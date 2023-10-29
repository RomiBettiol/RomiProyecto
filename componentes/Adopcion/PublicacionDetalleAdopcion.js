import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../HeaderScreen";
import axios from "axios";

const PublicacionDetalleAdopcion = ({ route }) => {
  const navigation = useNavigation();
  const { publicacion, token, userName } = route.params || {};
  // console.log(route.params);
  // console.log("PUBLICACION: ", publicacion);
  const [idUserAutor, setIdUserAutor] = useState("");
  const [userAutor, setUserAutor] = useState("");
  const carouselImages = publicacion.images;
  const [mensaje, setMensaje] = useState("");
  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);

  useEffect(() => {
    axios
      .get(`https://buddy-app2.loca.lt/security/user`, {
        headers: {
          "auth-token": token,
        },
      })
      .then((response) => {
        setUserAutor(response.data);
        setIdUserAutor(response.data[0].idUser);
        console.log("autor: ", userAutor, "id autor: ", idUserAutor);
        // Luego puedes usar idUser como desees en tu componente.
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [token, idUserAutor]);

  const handleNewChat = async (selectedUser) => {
    const idSelectedUser = selectedUser.idUser;
    const idAutor = idUserAutor;
    const idAdopcion = publicacion.idPublicationAdoption;
    const image = publicacion.user.image;
    console.log(
      "idUserautor: ",
      idAutor,
      "idUser seleccionado: ",
      idSelectedUser,
      "idPublicacion: ",
      idAdopcion,
      "image: ",
      image
    );
    try {
      //  console.log('antes del post ')
      // Realizar una solicitud POST al servidor para crear un nuevo chat
      const response = await axios.post(
        `https://buddy-app2.loca.lt/chats/chat/${idSelectedUser}?idReference=${idAdopcion}&referenceType=Adoption`,
        null,
        {
          headers: {
            "auth-token": token,
          },
        }
      );
      if (response.status === 201) {
        const id = response.data.idChat;
        navigation.navigate("Chats", {
          chatId: id,
          token: token,
          idUserRecep: idSelectedUser,
          nombre: selectedUser.userName,
          image: selectedUser.image,
          idAutor: selectedUser.idUser,
          idReference: idAdopcion,
          referenceType: "ADOPTION",
          imagenPublicacion: carouselImages[0],
        });
      } else if (response.status === 200) {
        setMensaje(
          "Ya existe un chat por con este usuario, no es posible crear otro. Lo redirigiremos en unos segundos..."
        );
        setShowCongratulationsModal(true);

        if (response.data.chat && response.data.chat.idChat) {
          const id = response.data.chat.idChat;
          setTimeout(() => {
            navigation.navigate("Chats", {
              chatId: id,
              token: token,
              idUserRecep: idSelectedUser,
              nombre: selectedUser.userName,
              image: selectedUser.image,
              idReference: idAdopcion,
              referenceType: "ADOPTION",
              imagenPublicacion: carouselImages[0],
            });
          }, 4000);
        } else {
          console.log(
            "No se pudo encontrar el ID del chat en la respuesta:",
            response.data
          );
        }
      } else {
        console.error("Error al crear el chat:", response.data);
        console.log("mensaje: ", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const id = error.response.data.chat.idChat;
        console.log("Ya existe un chat por esta publicación. ", error.response.data.message);
        setMensaje(
            "Ya existe un chat por esta publicación. Lo redirigiremos en unos segundos..."
        );
        setShowCongratulationsModal(true);
        setTimeout(() => {
          navigation.navigate("Chats", {
            chatId: id, // Reemplaza 'chatId' con la clave correcta para el ID del chat
            token: token, // Otras props que quieras pasar a la pantalla de chat
            idUserRecep: idSelectedUser,
            nombre: selectedUser.userName,
            image: selectedUser.image,
            idReference: idAdopcion,
            referenceType: "ADOPTION",
            imagenPublicacion: carouselImages[0],
          });
        }, 8000);
      } else {
        console.error("Error al crear el chat CATCH:", error);
      }
    }
  };
  return (
    <View>
      <Header />
      <ScrollView horizontal={true}>
        {carouselImages.map((item, index) => (
          <Image
            key={index}
            source={{ uri: item }}
            style={styles.imagenPublicacion}
          />
        ))}
      </ScrollView>
      <View style={styles.informacion}>
        <View style={styles.containerIconos}>
          <TouchableOpacity>
            <Image
              source={require("../../Imagenes/compartir.png")}
              style={styles.iconos}
            />
          </TouchableOpacity>
        </View>
        <View style={[{ flexDirection: "row" }, styles.contenedorTitulo]}>
          <Text style={styles.tituloPublicacion}>{publicacion?.title}</Text>
          <TouchableOpacity
            style={styles.botonInformacion}
            onPress={() => handleNewChat(publicacion?.user)} // Agregar lógica de manejo de clic aquí
          >
            <Text>¡Adoptar!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerDescripcion}>
          <Text style={styles.descripcionPublicacion}>
            {publicacion?.description}
          </Text>
          <View style={[styles.informacionFiltros, { flexDirection: "row" }]}>
            <View style={styles.derecha}>
              <View style={[styles.itemInfoFiltro, { flexDirection: "row" }]}>
                <Image
                  source={require("../../Imagenes/marcador-de-posicion.png")}
                  style={styles.iconos}
                />
                <Text style={styles.texto}>
                  {publicacion?.locality.localityName}
                </Text>
              </View>
              <View style={[styles.itemInfoFiltro, { flexDirection: "row" }]}>
                <Image
                  source={require("../../Imagenes/hueso.png")}
                  style={styles.iconos}
                />
                <Text style={styles.texto}>
                  {publicacion?.petBreed.petBreedName}
                </Text>
              </View>
              <View style={[styles.itemInfoFiltro, { flexDirection: "row" }]}>
                <Image
                  source={require("../../Imagenes/dueno.png")}
                  style={styles.iconos}
                />
                <Text style={styles.texto}>{publicacion?.user.userName}</Text>
              </View>
            </View>
            <View style={styles.izquierda}>
              <View style={[styles.itemInfoFiltro, { flexDirection: "row" }]}>
                <Image
                  source={require("../../Imagenes/paleta-de-color.png")}
                  style={styles.iconos}
                />
                <Text style={styles.texto}>
                  {publicacion?.petcolor.petColorName}
                </Text>
              </View>
              <View style={[styles.itemInfoFiltro, { flexDirection: "row" }]}>
                <Image
                  source={require("../../Imagenes/huella.png")}
                  style={styles.iconos}
                />
                <Text style={styles.texto}>
                  {publicacion?.petBreed.petType.petTypeName}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <Modal
        transparent={true}
        visible={showCongratulationsModal}
        animationType="slide"
        onRequestClose={() => setShowCongratulationsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, , { backgroundColor: "#FFB984" }]}>
            <Text style={styles.modalText}>{mensaje}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  imagenPublicacion: {
    width: 500,
    height: 380,
  },
  informacion: {
    backgroundColor: "#ffffff",
    height: "100%",
    width: "100%",
    borderRadius: 25,
    position: "absolute",
    marginTop: 480,
    padding: 30,
    paddingTop: 20,
  },
  tituloPublicacion: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  },
  descripcionPublicacion: {
    fontSize: 16,
  },
  iconos: {
    width: 25,
    height: 25,
    marginLeft: 10,
    marginRight: 10,
  },
  containerIconos: {
    marginLeft: "85%",
  },
  containerDescripcion: {
    justifyContent: "space-between",
    height: 280,
  },
  izquierda: {
    marginLeft: 30,
  },
  itemInfoFiltro: {
    marginTop: 10,
  },
  texto: {
    marginTop: 3,
  },
  informacionFiltros: {
    marginBottom: 25,
  },
  botonInformacion: {
    backgroundColor: "red",
    padding: 3,
    marginLeft: 10,
    height: 30,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    backgroundColor: "#DDC4B8",
  },
  contenedorTitulo: {
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    backgroundColor: "#FFB984", // Cambia el color de fondo del botón de acuerdo a tus preferencias
    borderRadius: 5,
  },
});

export default PublicacionDetalleAdopcion;
