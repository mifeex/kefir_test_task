import comments from "src/tasks/2/data/comments";
import authors from "src/tasks/2/data/authors";

const getDataRequest = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (Math.random() > 0.05) {
        return {
            comments,
            authors,
        };
    }

    throw new Error("Не удалось загрузить данные");
};

export default getDataRequest;
