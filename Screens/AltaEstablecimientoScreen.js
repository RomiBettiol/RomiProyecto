import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import HeaderScreen from "../componentes/HeaderScreen";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

const AltaEstablecimientoScreen = () => {
  const [establishments, setEstablishments] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = route.params;
  const [isLoading, setisLoading] = useState(false);

  const fetchData = async () => {
    try {
      setisLoading(true);
      const config = {
        headers: {
          "auth-token": token,
        },
      };

      const response = await axios.get(
        "https://37e1-186-12-32-189.ngrok-free.app/security/establishment/revision",
        config
      );

      setEstablishments(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleDetalle = (establishmentId) => {
    navigation.navigate("EstablecimientoDetalleScreen", {
      token,
      establishmentId,
    });
  };

  return (
    <View style={styles.container}>
      <HeaderScreen token={token} />
      <Text style={styles.title}>Establecimientos en revision</Text>
      {!establishments[0] && (
        <View style={styles.ItemContainer}>
          <Text style={styles.ItemName}>
            No hay usuarios pendientes de aprobación.
          </Text>
        </View>
      )}
      {establishments.map((item) => (
        <View key={item.idUser} style={styles.ItemContainer}>
          <View style={styles.Item}>
            <Image source={{ uri: item.image }} style={styles.userImage} />
            <View style={styles.ItemInfo}>
              <Text style={styles.ItemName}>{item.userName}</Text>
              <Text style={styles.ItemText}>{item.mail}</Text>
            </View>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => {
                  handleDetalle(item.idUser);
                }}
              >
                <Text style={styles.optionButtonText}>
                  Revisar solicitud de alta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      <Modal visible={isLoading} transparent>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 25,
    marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 5,
    fontWeight: "bold",
    color: "#333",
  },
  Item: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    marginHorizontal: 10,
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  ItemContainer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  ItemInfo: {
    flex: 1,
  },
  ItemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  ItemText: {
    fontSize: 14,
    color: "#888",
  },
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionButton: {
    backgroundColor: "#FFB988",
    padding: 5,
    marginHorizontal: 2,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  optionButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default AltaEstablecimientoScreen;
