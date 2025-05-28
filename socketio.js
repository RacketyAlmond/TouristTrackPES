import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = {};
    this.userId = null;
    this.API_BASE_URL = '***REMOVED***';
  }

  connect(userId) {
    if (this.socket && this.socket.connected) {
      console.log('Socket ya conectado');
      return this.socket;
    }

    this.userId = userId;
    console.log(
      `Conectando socket para usuario ${userId} a ${this.API_BASE_URL}`,
    );

    try {
      const socketUrl = this.API_BASE_URL.startsWith('http')
        ? this.API_BASE_URL
        : `http://${this.API_BASE_URL}`;

      console.log(`URL final del socket: ${socketUrl}`);

      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'], // Allow polling fallback
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 10000, // Increase timeout
      });

      // Inicializar las listas de listeners para los eventos principales
      this.listeners = {
        connect: [],
        disconnect: [],
        new_message: [],
        typing_start: [],
        typing_end: [],
        message_read: [],
        user_status_change: [],
      };

      // Configurar manejadores para eventos básicos
      this.socket.on('connect', () => {
        console.log(`Socket conectado: ${this.socket.id}`);
        this.connected = true;
        this.socket.emit('register_user', userId);

        // Llamar a los callbacks registrados para 'connect'
        if (this.listeners.connect) {
          this.listeners.connect.forEach((callback) => callback());
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log(`Socket desconectado: ${reason}`);
        this.connected = false;

        // Llamar a los callbacks registrados para 'disconnect'
        if (this.listeners.disconnect) {
          this.listeners.disconnect.forEach((callback) => callback(reason));
        }
      });

      // Configurar los listeners para los eventos de chat
      this.socket.on('new_message', (message) => {
        console.log('Nuevo mensaje recibido:', message);

        console.log('/////////////////////////////');
        console.log('ID del mensaje:', message.id);
        console.log('Contenido del mensaje:', message.content);
        console.log('ID del remitente:', message.sentByID);
        console.log('ID del destinatario:', message.sentToID);

        // Llamar a los callbacks registrados para 'new_message'
        if (this.listeners.new_message) {
          this.listeners.new_message.forEach((callback) => callback(message));
        }
      });

      this.socket.on('typing_start', (data) => {
        if (this.listeners.typing_start) {
          this.listeners.typing_start.forEach((callback) => callback(data));
        }
      });

      this.socket.on('typing_end', (data) => {
        if (this.listeners.typing_end) {
          this.listeners.typing_end.forEach((callback) => callback(data));
        }
      });

      this.socket.on('message_read', (data) => {
        if (this.listeners.message_read) {
          this.listeners.message_read.forEach((callback) => callback(data));
        }
      });

      this.socket.on('user_status_change', (data) => {
        if (this.listeners.user_status_change) {
          this.listeners.user_status_change.forEach((callback) =>
            callback(data),
          );
        }
      });

      return this.socket;
    } catch (error) {
      console.error('Error inicializando Socket.io:', error);
      return null;
    }
  }

  // Desconectar el socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log('Socket desconectado manualmente');
    }
  }

  // Registrar un callback para un evento
  // En socketio.js - Mejora el método on() para confirmar que los eventos se registran correctamente
  on(event, callback) {
    console.log(`➡️ Registrando listener para evento: ${event}`);

    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
    console.log(
      `✅ Listener registrado para ${event}, total: ${this.listeners[event].length}`,
    );

    return () => {
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter(
          (cb) => cb !== callback,
        );
        console.log(`❌ Eliminado listener para ${event}`);
      }
    };
  }

  // Emitir un evento
  emit(event, data, callback) {
    if (!this.socket || !this.connected) {
      console.warn('Socket no conectado. No se puede enviar evento.');
      return;
    }

    this.socket.emit(event, data, callback);
  }

  // Enviar mensaje
  sendMessage(recipientId, content) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.connected) {
        reject(new Error('Socket no conectado'));
        return;
      }

      const messageData = {
        sentByID: this.userId,
        sentToID: recipientId,
        content,
        timestamp: new Date(),
      };

      console.log('Enviando mensaje vía socket:', messageData);

      this.socket.emit('send_message', messageData, (response) => {
        if (response && response.success) {
          resolve(response.message);
        } else {
          reject(new Error(response?.error || 'Error enviando mensaje'));
        }
      });
    });
  }

  // Marcar mensaje como leído
  markAsRead(messageId) {
    if (this.socket && this.socket.connected) {
      console.log(`Marcando mensaje ${messageId} como leído`);
      this.socket.emit('mark_read', { messageId });
    }
  }

  // Estado de escritura
  sendTypingStatus(recipientId, isTyping) {
    if (!this.socket || !this.connected) return;

    const event = isTyping ? 'typing_start' : 'typing_end';
    this.socket.emit(event, {
      senderId: this.userId,
      recipientId,
    });
  }

  // Verificar conexión
  isConnected() {
    return this.connected && this.socket?.connected;
  }
}

// Crear instancia única
const socketService = new SocketService();
export default socketService;
