import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ranks = [
  {
    name: 'Viajero Primerizo',
    name_en: 'First Time Traveler',
    minLevel: 3,
    icon: require('../../public/traveler.png'),
    thickIcon: require('../../public/traveler_thick.png'),
  },
  {
    name: 'Mochilero Curioso',
    name_en: 'Keen Backpacker',
    minLevel: 5,
    icon: require('../../public/backpacker.png'),
    thickIcon: require('../../public/backpacker_thick.png'),
  },
  {
    name: 'Aventurero Intrépido',
    name_en: 'Fearless Adventurer',
    minLevel: 7,
    icon: require('../../public/adventurer.png'),
    thickIcon: require('../../public/adventurer_thick.png'),
  },
  {
    name: 'Explorador Nato',
    name_en: 'Master Explorer',
    minLevel: 10,
    icon: require('../../public/explorer.png'),
    thickIcon: require('../../public/explorer_thick.png'),
  },
  {
    name: 'Leyenda Nómada',
    name_en: 'Nomadic Legend',
    minLevel: 15,
    icon: require('../../public/legend.png'),
    thickIcon: require('../../public/legend_thick.png'),
  },
  {
    name: 'TROTAMUNDOS',
    name_en: 'World Wanderer',
    minLevel: 20,
    icon: require('../../public/globetrotter.png'),
    thickIcon: require('../../public/globetrotter_thick.png'),
  },
];

const getLevelInfo = (points) => {
  const levels = [
    { level: 1, required: 0 },
    { level: 2, required: 100 },
    { level: 3, required: 250 },
    { level: 4, required: 500 },
    { level: 5, required: 1000 },
    { level: 6, required: 2000 },
    { level: 7, required: 3500 },
    { level: 8, required: 5000 },
    { level: 9, required: 7000 },
    { level: 10, required: 10000 },
    { level: 11, required: 13000 },
    { level: 12, required: 16500 },
    { level: 13, required: 20000 },
    { level: 14, required: 24000 },
    { level: 15, required: 28000 },
    { level: 16, required: 32500 },
    { level: 17, required: 37500 },
    { level: 18, required: 43000 },
    { level: 19, required: 50000 },
    { level: 20, required: 60000 },
  ];

  let current = levels[0];
  let next = levels[levels.length - 1];

  for (let i = 0; i < levels.length; i++) {
    if (points >= levels[i].required) {
      current = levels[i];
      next = levels[i + 1] || null;
    }
  }

  const progress = next
    ? ((points - current.required) / (next.required - current.required)) * 100
    : 100;

  return {
    currentLevel: current.level,
    nextLevel: next?.level || null,
    progress: Math.min(progress, 100),
  };
};

export const getRankByLevel = (level, thick = false) => {
  const rank = ranks
    .slice()
    .reverse()
    .find((rank) => level >= rank.minLevel);

  if (rank) {
    return {
      ...rank,
      icon: thick ? rank.thickIcon : rank.icon,
    };
  }

  return null;
};

const LevelProgress = ({ points }) => {
  if (points === null || points === undefined) return null;

  const levelInfo = getLevelInfo(points);
  const rank = getRankByLevel(levelInfo.currentLevel);
  return (
    <View style={styles.levelContainer}>
      {rank && (
        <View style={styles.rankContainer}>
          <Image source={rank.icon} style={styles.rankIcon} />
          <Text style={styles.rankText}>{rank.name}</Text>
        </View>
      )}
      <View style={styles.progressRow}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${levelInfo.progress}%` },
            ]}
          />
        </View>
        <Text style={styles.levelText}>Nivel {levelInfo.currentLevel}</Text>
      </View>

      <Text style={styles.pointsText}>
        {points} puntos
        {levelInfo.nextLevel ? ` - Próximo nivel: ${levelInfo.nextLevel}` : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  levelContainer: {
    width: '90%',
    alignItems: 'center',
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginRight: 10,
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#7B1FA2',
    borderRadius: 5,
  },

  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 60,
  },

  pointsText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
    marginBottom: 15,
  },

  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 10,
  },

  rankIcon: {
    width: 48,
    height: 48,
    marginRight: 8,
  },

  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default LevelProgress;
