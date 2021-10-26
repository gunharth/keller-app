function writeDataToFirebase() {
	// Firestore setup
	const email = 'keller-app-446@keller-app-25789.iam.gserviceaccount.com';
	const key =
		'-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCrRI3Af5JPpzuU\nifu8dh3Hbu39a0cloW4ifekrRvCgW1Gu2cWNf9FOE40tjeADRObzKjuETjJLr//8\n/n8/szGCHkOwv7Ljo6qFXMjof2LbThbNf5D/g3NfwCkIxgeP0gJ2Tw3UUTof40A2\nluXhJntzI2emvmrrm0ktHPvyTJcGq7ahpE5Oc5CA9wuM6fMqq7A/8bo46NQ7Bl9L\nnbdY3r7JYZlRJ9PcUas0wLu9516H4x2m8e9UEbC6wHqa2j+5tHppTIdJbqx5Fhij\ny85HvOde2T5QEEKSo2R1RunYn1uIMUOeKpajo5q/0rcgSYxj5KBrKWSp9RA6vJra\n/b4iN5A/AgMBAAECggEAIB27XTEu/RvVit2zJJybqfXN0BtJXK+gaPxmeJSVc+Sb\n9SdmKcohtDvrWfMEYmiNzGSLg5xsRxAqd0U8FHRkYMuPEvpnr9NVmyuSizK0FX7X\nvNJinN+IB5kPuNL1wQz3JDtf0wQmW6twM6xpUCa4uJcXjUeg4iyc9MY+IqolGf1T\npgN/kOg4BWmKsu6ujMcFajKb6PQXEAv+KvHybgb8NsZcWQStGvCTwzbsWk+erYfy\nqttrM5QNietfMYLpS213MErnEwjHdyI2JLfuTcAza7149+e3BfAz24kmiZNOtaa4\nLEQKghOTDAY1IOCYVaDciy+QA1mfqqdEkgEOU3iLWQKBgQDbE5CM0/LTjfHTvFdE\nyj0NXbvvfuMH7RLhHSu7Qhs2FSibG0Gq61SvxTMKC3Nyy/v3PIwHvehV+CIntxb1\n5xD2ZILvdQUMunCAUjWwu0Eo0/Ux3YThI9Hho5qao1yxdi2wAhHZpAU/IQVj02pQ\nUtj1Fb83kloxxsxqeAnFHQ9rWQKBgQDIIjOtY6KZm2zz+tSpviCpoNUKglze1KRS\nLXwRxjkrvb2haXHBQPGCtxp3mwTMmWeOrYNZBUyGXryWrO8cJ5d5G8BjfmJtTgWB\nLVmEqErZ0lpiTdjiD1Cf734AQ9sJH0OKjHVrTuDGOEcsAvsEvD/wyFNaE/+V4g/D\nijy8/DkdVwKBgQCj7i/sMW0zALRETFrBDtRAfDN1Mu2PsMa/zKQ8q2rRPWP1LKAm\n1ZG5NUbL7WWmMR2KE7R01pZUPijQryBvQUhgFzYjGN1+eMRWQS4L4RMRCgogFjKo\nhbU3ssStkjB6WoQ1gFb7FNEYPA1cdYbINDZErtE3NDxpouizgr9M0EIJgQKBgBhL\nrqJZ+h9TswJbbP2+SxDMqZBBCy0x+1DOnMU7ny0kN6Uku96OF8OanufuNcLwzJWR\nkuR3tDaLwbE5BT4RwF2/dLefXCuQ0TJBYyCrnYqb8sUEVlP7L/p6hH1bv3d4CCcF\nrit8w+TMaDd7lSWaBNkiOJwy2VBExU0jtwPqSrS5AoGAXBKNE5T8giizIvW7Pjeb\nZiFNUI9jwB8Y7iNx/Xdkafzbu3WmvRr1X+IsgsHjwjFSaorjyHZnwmsQVUCuqVYV\n9kYGRAphVIHqFiSMgI6ohrcGuJJF11Ky1LMGBCZlsBgqp1TRHuqfNDA9MOy6cbc/\nK/i57S9ku5Whyi2CDGwH4gA=\n-----END PRIVATE KEY-----\n';
	const projectId = 'keller-app-25789';
	var firestore = FirestoreApp.getFirestore(email, key, projectId);

	//firestore.createDocument("wasisimkella",dataToImport);

	var ss = SpreadsheetApp.openById(getEnvironment().spreadsheetID);
	var sheet = ss.getSheets()[0];
	var data = sheet.getDataRange().getValues();
	var dataToImport = {};
	for (var i = 1; i < data.length; i++) {
		if (data[i][1] !== '') {
			var d = {};

			d.id = data[i][0];
			d.art = data[i][1];
			//dataToImport[data[i][0]] = {};
			//let row = ""
			//for (var j = 0; j < data[0].length; j++) {
			// row = assign(dataToImport[data[i][0]], data[0][j].split("__"), data[i][j]);
			//}

			firestore.createDocument('wasisimkella', d, d.id, d.id);
		}
	}
	//var firebaseUrl = getEnvironment().firebaseUrl;
	//var base = FirebaseApp.getDatabaseByUrl(firebaseUrl);
	//base.setData("wasisimkella", dataToImport);
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
