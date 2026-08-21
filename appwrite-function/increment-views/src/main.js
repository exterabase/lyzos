import { Client, Databases, ID } from "node-appwrite";

// Appwrite Function: increment-views
// Триггерится HTTP-выполнением (execution) с фронтенда сайта.
// Инкрементит счётчик просмотров в Appwrite Database и возвращает { views: N }.
//
// Переменные окружения (задаются в настройках функции в консоли Appwrite):
//   APPWRITE_DATABASE_ID   — ID базы данных (например "site")
//   APPWRITE_COLLECTION_ID — ID коллекции (например "stats")
//   APPWRITE_DOCUMENT_ID   — ID документа-счётчика (например "views")
//
// APPWRITE_FUNCTION_API_KEY, APPWRITE_FUNCTION_PROJECT_ID и endpoint
// Appwrite подставляет автоматически в рантайме функции — руками задавать не нужно.

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT ?? "https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers["x-appwrite-key"] ?? "");

  const databases = new Databases(client);

  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const collectionId = process.env.APPWRITE_COLLECTION_ID;
  const documentId = process.env.APPWRITE_DOCUMENT_ID ?? "views";

  if (!databaseId || !collectionId) {
    error("Не заданы APPWRITE_DATABASE_ID / APPWRITE_COLLECTION_ID");
    return res.json({ error: "Function is not configured" }, 500);
  }

  try {
    let current;

    try {
      current = await databases.getDocument(databaseId, collectionId, documentId);
    } catch (e) {
      // Документа ещё нет — создаём с нуля
      current = await databases.createDocument(databaseId, collectionId, documentId, {
        count: 0,
      });
    }

    const newCount = (current.count ?? 0) + 1;

    const updated = await databases.updateDocument(databaseId, collectionId, documentId, {
      count: newCount,
    });

    return res.json({ views: updated.count });
  } catch (e) {
    error("Ошибка инкремента счётчика: " + e.message);
    return res.json({ error: "Internal error" }, 500);
  }
};
