function onOpen() {
	SpreadsheetApp.getUi()
		.createMenu('🔥 Firebase')
		.addItem('⏪ Export to Firestore', 'menuExport')
		.addToUi();
}

function menuExport() {
	writeDataToFirebase();
}

function writeDataToFirebase() {
	var ss = SpreadsheetApp.openById(getEnvironment().spreadsheetID);
	var sheet = ss.getSheets()[0];
	var data = sheet.getDataRange().getValues();
	var dataToImport = {};
	for (var i = 1; i < data.length; i++) {
		dataToImport[data[i][0]] = {};
		for (var j = 0; j < data[0].length; j++) {
			assign(dataToImport[data[i][0]], data[0][j].split('__'), data[i][j]);
		}
	}
	var firebaseUrl = getEnvironment().firebaseUrl;
	var base = FirebaseApp.getDatabaseByUrl(firebaseUrl);
	base.setData('wasisimkella', dataToImport);
	//firestore.dataToImport("wasisimkella", dataToImport);
}

function getEnvironment() {
	var environment = {
		spreadsheetID: '1K9CNpzM3Vh4lJSTIiU1NEKLGiSzBvPW8aeK96Tyu5gw',
		firebaseUrl: 'https://keller-app-25789-default-rtdb.europe-west1.firebasedatabase.app/'
	};
	return environment;
}

// A utility function to generate nested object when
// given a keys in array format
function assign(obj, keyPath, value) {
	lastKeyIndex = keyPath.length - 1;
	for (var i = 0; i < lastKeyIndex; ++i) {
		key = keyPath[i];
		if (!(key in obj)) obj[key] = {};
		obj = obj[key];
	}
	obj[keyPath[lastKeyIndex]] = value;
}
