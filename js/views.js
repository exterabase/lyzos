// ==========================================================================
// LyzosViews — счётчик просмотров сайта через Appwrite Function + Database.
// Никакого localStorage/куки: каждый заход инкрементит счётчик на бэкенде
// (Appwrite Function -> Appwrite Database), значение считает сервер, а не браузер.
// ==========================================================================

(function () {
  // ---- Настройки под твой проект Appwrite ----
  const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1";
  const APPWRITE_PROJECT_ID = "6a88a994001db87195f7";
  const APPWRITE_FUNCTION_ID = "6a88c72f00361339994b";  // ID функции lyzos

  let sdkLoadPromise = null;

  function loadAppwriteSdk() {
    if (window.Appwrite) return Promise.resolve(window.Appwrite);
    if (sdkLoadPromise) return sdkLoadPromise;

    sdkLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/appwrite@16.0.2";
      script.async = true;
      script.onload = () => resolve(window.Appwrite);
      script.onerror = () => reject(new Error("Не удалось загрузить Appwrite SDK"));
      document.head.appendChild(script);
    });

    return sdkLoadPromise;
  }

  async function increment() {
    try {
      const { Client, Functions } = await loadAppwriteSdk();

      const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID);

      const functions = new Functions(client);

      const execution = await functions.createExecution(
        APPWRITE_FUNCTION_ID,
        "", // body не нужен — вся логика внутри функции
        false, // async = false, ждём результат сразу
        "/",
        "POST"
      );

      const responseBody = execution.responseBody || execution.response || "{}";
      const parsed = typeof responseBody === "string" ? JSON.parse(responseBody) : responseBody;

      const count = parsed.views ?? parsed.count ?? null;

      updateCounterElements(count);
      return count;
    } catch (error) {
      console.error("LyzosViews: ошибка счётчика просмотров:", error);
      updateCounterElements(null);
      return null;
    }
  }

  function updateCounterElements(count) {
    document.querySelectorAll("[data-views-count]").forEach((el) => {
      el.textContent = count !== null && count !== undefined ? count.toLocaleString("ru-RU") : "—";
    });
  }

  window.LyzosViews = { increment };
})();
