import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Swiper from "react-native-deck-swiper";
import { LinearGradient } from "expo-linear-gradient";

const index = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Fetch cards data from your backend or set them manually
    setCards([
      {
        id: 1,
        name: "John Doe",
        age: 25,
        image:
          "https://png.pngtree.com/png-clipart/20190924/original/pngtree-businessman-user-avatar-free-vector-png-image_4827807.jpg",
      },
      {
        id: 2,
        name: "Jane Smith",
        age: 28,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThRyukDe4q5dJpXgg5nIegQYQf66HXPGm57S_9EpJYbZtm0WP0R29sB9gxyUJZEqTew7Y&usqp=CAU",
      },
      // Add more cards as needed
    ]);
  }, []);

  const renderCard = (card) => {
    if (!card) return null; // Add this to prevent rendering errors

    return (
      <View style={styles.card}>
        <Image source={{ uri: card.image }} style={styles.image} />
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={styles.overlay}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>
            {card.name}, {card.age}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={cards}
        renderCard={renderCard}
        onSwiped={(cardIndex) => {
          console.log(cards[cardIndex].name + " swiped");
        }}
        onSwipedAll={() => {
          console.log("All cards swiped");
        }}
        cardIndex={0}
        backgroundColor={"#f5f5f5"}
        stackSize={3}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: "#fff",
    width: "90%",
    height: "75%",
  },
  image: {
    flex: 1,
    borderRadius: 10,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    borderRadius: 10,
  },
  textContainer: {
    position: "absolute",
    left: 20,
    bottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
});
