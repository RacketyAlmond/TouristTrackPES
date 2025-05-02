// BirthdateScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground
} from "react-native";
import { useUser } from "../contexts/UserContext.js";
import map from "./map.png";
import DatePicker from 'react-native-date-picker'
import { Button } from 'react-native'


const BirthdateScreen = ({ onComplete }) => {
    const { createUserData } = useUser();
    const [fname, setFname] = useState("");
    const [userLocation, setUserLocation] = useState("");
    const [birthdate, setBirthdate] = useState(new Date())
    const [open, setOpen] = useState(false)

    const handleSend = async () => {
        try {
            const about = "Hi! I'm using TouristTrack";
            await createUserData(fname, birthdate.toDateString(), userLocation, about);
            onComplete();
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    return (

        <ImageBackground source={map} style={styles.backgroundImage}>
            <View style={styles.overlay} />
            <View style={styles.overlay2} />
            <View style={styles.overlay3} />
            <View style={styles.overlay4} />

        <View style={styles.container}>
            <Text style={styles.title}>Tell us more about yourself</Text>
            <View style={styles.inputContainer}>
                <DatePicker
                    modal
                    open={open}
                    date={birthdate}
                    mode="date"
                    onConfirm={(date) => {
                        setOpen(false)
                        setBirthdate(date)
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />
                <Text style={styles.text}>First name</Text>

                <TextInput
                placeholder="First name"
                value={fname}
                onChangeText={setFname}
                style={styles.input}
            />
                <Text style={styles.text}>Date of birth</Text>

                <TouchableOpacity onPress={() => setOpen(true)} style={styles.input}>
                    <Text>{birthdate.toDateString()}</Text>
                </TouchableOpacity>
                <Text style={styles.text}>Where are you from</Text>

                <TextInput
                placeholder="Location"
                value={userLocation}
                onChangeText={setUserLocation}
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleSend}>
                <Text style={styles.buttonText}>Save Data</Text>
            </TouchableOpacity>
            </View>

        </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: "20%",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
    },
    overlay2: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: "40%",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    overlay3: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: "60%",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
    },
    overlay4: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: "80%",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    inputContainer: {
        width: "90%",
        padding: 20,
        backgroundColor: "rgba(230, 230, 230, 0.5)",
        borderRadius: 20,
        alignItems: "center",
    },
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
    text: { width: "80%"},

    input: { width: "80%", padding: 10, margin: 15, marginTop: 9, borderWidth: 1, borderRadius: 5 },
    button: { backgroundColor: "#a020f0", padding: 10, width: "80%", marginTop: 10, borderRadius: 5, alignItems: "center" },
    buttonText: { color: "white", fontSize: 16 },
});

export default BirthdateScreen;
