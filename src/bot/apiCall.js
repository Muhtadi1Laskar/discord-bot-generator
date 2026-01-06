export const makeAPICall = async (requestBody) => {
    const URL = "http://localhost:8080/api/bot/moderator";
    const body = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    }

    try {
        const response = await fetch(URL, body);

        if (!response.ok) {
            throw new Error("HTTP error ! status: ", response.status);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error during fetch operation: ", error.message);
    }
}