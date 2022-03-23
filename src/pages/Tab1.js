import { IonPage } from "@ionic/react";
import { AppLauncher } from "@capacitor/app-launcher";
import ExploreContainer from "../components/ExplorerContainer";
import { IonToolbar } from "@ionic/react";
import { IonHeader } from "@ionic/react";
import { IonTitle } from "@ionic/react";
import { IonContent } from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";
import { useState, useEffect } from "react";
import { App } from "@capacitor/app";
import { BackgroundTask } from "@robingenz/capacitor-background-task";
import axios from "axios";
const Tab1 = () => {
  const openPortfolioPage = async () => {
    await AppLauncher.openUrl({ url: "com.google.android.apps.maps" });
  };
  var list = [];
  function sleepFor(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) {
      /* Do nothing */
    }
  }
  const getCoords = async (type) => {
    (async function my_func() {
      // your code
      const coordinates = await Geolocation.getCurrentPosition();
      if (coordinates) {
        axios
          .post(
            `http://192.168.0.107:3000/location`,
            {
              at: new Date(coordinates.timestamp).toUTCString(),
              latitude: coordinates.coords.latitude,
              longitude: coordinates.coords.longitude,
            },
            { headers: { "Content-Type": "application/json" } }
          )
          .then((res) => {
            console.log("saving in db.json", res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      sleepFor(5000);
      my_func();
    })();
  };

  getCoords();

  App.addListener("appStateChange", async ({ isActive }) => {
    if (isActive) {
      return;
    }
    // The app state has been changed to inactive.
    // Start the background task by calling `beforeExit`.
    const taskId = await BackgroundTask.beforeExit(async () => {
      // Run your code...
      getCoords("bg");
      // Finish the background task as soon as everything is done.
      BackgroundTask.finish({ taskId });
    });
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer
          name={<button onClick={openPortfolioPage}>Navigation button</button>}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
