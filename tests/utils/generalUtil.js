async function converDateIntoNumberFormat(inputDate) {
    const date = new Date(inputDate);
    const date2 = new Date('');

    // Extract the components
    const day = date.getDate(); // Get the day of the month (1-31)
    const month = date.getMonth() + 1; // Get the month (0-11), so add 1 to make it (1-12)
    const year = date.getFullYear(); // Get the full year (e.g., 2024)

    // Log the results
    console.log("Day:", day + " Month:", month + " Year:", year); // Output of Year
    return {Day:day, Month: month, Year: year};
}

async function getValueOf(key, filePath = "./environments/CPQ.properties") {
	const PropertiesReader = require('properties-reader');
	try {
		const prop = PropertiesReader(filePath);
		return prop.get(key);
	} catch (error) {
		console.log("Exception came while fetching the value of key: " + key + " from " + filePath);
		cosole.log(error);
	}
}

async function setValue(key, value, filePath = "./environments/CPQ.properties") {
	const PropertiesReader = require('properties-reader');
	try {
		const prop = PropertiesReader(filePath);
		return prop.set(key, value);
	} catch (error) {
		console.log("Exception came while writing the value of key: " + key + ", value: " + value + ", file=" + filePath);
		cosole.log(error);
	}
}


module.exports = {
    converDateIntoNumberFormat,
    getValueOf,
    setValue,
};