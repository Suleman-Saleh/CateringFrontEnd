import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const SERVICES = [
  { id: 1, title: "Easy Booking", description: "Book your events hassle-free with our intuitive platform." },
  { id: 2, title: "Fast Delivery", description: "Reliable and quick service, from start to finish." },
  { id: 3, title: "24/7 Support", description: "We’re here whenever you need help or have questions." },
  { id: 4, title: "Custom Events", description: "Tailor your event exactly how you want it." },
];

function ServiceTile({ title, description, animValue }) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animValue.value,
    transform: [
      { translateY: withTiming(animValue.value === 1 ? 0 : 20, { duration: 700 }) },
      { scale: withTiming(animValue.value === 1 ? 1 : 0.95, { duration: 700 }) },
    ],
    shadowOpacity: animValue.value * 0.3,
  }));

  return (
    <Animated.View style={[styles.tile, animatedStyle]}>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileDescription}>{description}</Text>
    </Animated.View>
  );
}

// Custom cursor for web only
function CustomCursor() {
  if (Platform.OS !== "web") return null;

  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.clientX ?? 0;
      const y = e.clientY ?? 0;
      setPos({ x, y });
    };

    document.addEventListener("mousemove", handleMove, { passive: true });
    return () => document.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <View
      style={[
        styles.cursor,
        { transform: [{ translateX: pos.x }, { translateY: pos.y }] },
      ]}
    />
  );
}

export default function LandingScreen() {
  const navigation = useNavigation();

  // Animation values
  const titleTranslateY = useSharedValue(-60);
  const titleScale = useSharedValue(0.8);
  const subtitleTranslateY = useSharedValue(-30);
  const subtitleScale = useSharedValue(0.85);
  const vanX = useSharedValue(-width * 0.7);
  const vanScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const tilesAnim = SERVICES.map(() => useSharedValue(0));
  const [buttonPressed, setButtonPressed] = useState(false);

  useEffect(() => {
    // Title
    titleTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) });
    titleScale.value = withSequence(withTiming(1.1, { duration: 400 }), withTiming(1, { duration: 300 }));

    // Subtitle
    subtitleTranslateY.value = withDelay(300, withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) }));
    subtitleScale.value = withDelay(
      300,
      withSequence(withTiming(1.05, { duration: 400 }), withTiming(1, { duration: 300 }))
    );

    // Tiles
    tilesAnim.forEach((anim, i) => {
      anim.value = withDelay(1100 + i * 250, withTiming(1, { duration: 700 }));
    });

    // Van image
    vanX.value = withDelay(600, withTiming(0, { duration: 1200, easing: Easing.out(Easing.exp) }));
    vanScale.value = withDelay(1900, withSequence(withTiming(1.1, { duration: 300 }), withTiming(1, { duration: 300 })));

    // Button pulse
    buttonScale.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1,
      true
    );
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }, { scale: titleScale.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: subtitleTranslateY.value }, { scale: subtitleScale.value }],
  }));

  const vanAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: vanX.value }, { scale: vanScale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    shadowColor: "#6A1B9A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#7B1FA2", "#9C27B0"]} start={[0, 0]} end={[1, 1]} style={styles.gradientContainer}>
        <Animated.View style={titleAnimatedStyle}>
          <Text style={styles.title}>Eventures</Text>
        </Animated.View>

        <Animated.View style={subtitleAnimatedStyle}>
          <Text style={styles.subtitle}>Your event, your adventure</Text>
        </Animated.View>

        <Animated.Image
          source={require("../assets/delivery.png")}
          style={[styles.van, vanAnimatedStyle]}
          resizeMode="contain"
        />

        <Animated.View style={[buttonAnimatedStyle, styles.buttonWrapper]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Login")}
            onPressIn={() => setButtonPressed(true)}
            onPressOut={() => setButtonPressed(false)}
            style={[styles.button, buttonPressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.tilesContainer}
        showsVerticalScrollIndicator={false}
      >
        {SERVICES.map((service, i) => (
          <ServiceTile
            key={service.id}
            title={service.title}
            description={service.description}
            animValue={tilesAnim[i]}
          />
        ))}
      </ScrollView>

      <CustomCursor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  gradientContainer: {
    height: height * 0.65,
    paddingTop: Platform.OS === "web" ? 50 : 70,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: width < 500 ? 38 : 54,
    fontWeight: "900",
    color: "white",
    letterSpacing: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: width < 500 ? 16 : 18,
    color: "white",
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  van: { width: width * 0.5, height: height * 0.22, marginBottom: 20 },
  buttonWrapper: { marginTop: 0, marginBottom: 10 },
  button: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#7B1FA2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  buttonText: { color: "#7B1FA2", fontWeight: "900", fontSize: 21, letterSpacing: 1.8 },
  tilesContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 80,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  tile: {
    backgroundColor: "#7B1FA2",
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginBottom: 20,
    width: "48%",
    shadowColor: "#9C27B0",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    alignItems: "center",
  },
  tileTitle: { color: "white", fontSize: 19, fontWeight: "700", marginBottom: 6, textAlign: "center" },
  tileDescription: { color: "#D1C4E9", fontSize: 14, textAlign: "center", lineHeight: 20 },
  cursor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "transperent",
    position: "absolute",
    pointerEvents: "none",
  },
});
