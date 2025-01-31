// Parses a .geojson or .json file and extracts basic metadata
export const parseGeoJSONFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            try {
                const jsonData = JSON.parse(reader.result); // Parse the JSON content

                resolve({
                    filename: file.name,
                    fileSize: file.size, // Size in bytes
                    fileContent: jsonData
                });
            } catch (error) {
                reject(new Error("Invalid GeoJSON/JSON file format."));
            }
        };

        reader.onerror = () => reject(new Error("Error reading the file."));
        reader.readAsText(file);
    });
};
