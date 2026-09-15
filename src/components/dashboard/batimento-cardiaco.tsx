"use client";

import { useEffect } from "react";

const INTERVALO_BATIDA_MS = 60 * 1000;

export function BatimentoCardiaco() {
  useEffect(() => {
    const enviarBatida = () => {
      void fetch("/api/dashboard/heartbeat", { method: "POST", cache: "no-store" }).catch(
        () => undefined,
      );
    };

    enviarBatida();
    const temporizador = window.setInterval(enviarBatida, INTERVALO_BATIDA_MS);

    return () => window.clearInterval(temporizador);
  }, []);

  return null;
}
