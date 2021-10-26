// Create menu items
function onOpen() {
	SpreadsheetApp.getUi()
		.createMenu('🔥 Firebase')
		.addItem('⏪ Export to Firestore', 'menuExport')
		.addItem('⏩ Import from Firestore', 'menuImport')
		.addToUi();
}

function menuExport() {
	main(true);
}

function menuImport() {
	main(false);
}

function main(exportData) {
	// Get the active spreadsheet and it's name for the collection name
	var sheet = SpreadsheetApp.getActiveSheet();
	var sheetName = sheet.getName();

	// Get the first row as object properties
	// [ 'id', 'name', 'description', 'projectUrl', 'messageForParents', 'furtherResources', 'category', 'toDelete' ]
	var properties = getProperties(sheet);

	// Get all the data from the sheet, however many rows that may be
	// [ [ (empty), 'My Project' ,'Fun!', 'https://test.me' ,'Hello', 'some extra' ,'Test Category 1', (empty?) ], ..., ... ]
	var records = getRecords(sheet);

	const collectionName = 'keller'; // TODO - enter your collection name here

	// Details on how to set it up came from here: https://github.com/grahamearley/FirestoreGoogleAppsScript
	const key =
		'-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCrRI3Af5JPpzuU\nifu8dh3Hbu39a0cloW4ifekrRvCgW1Gu2cWNf9FOE40tjeADRObzKjuETjJLr//8\n/n8/szGCHkOwv7Ljo6qFXMjof2LbThbNf5D/g3NfwCkIxgeP0gJ2Tw3UUTof40A2\nluXhJntzI2emvmrrm0ktHPvyTJcGq7ahpE5Oc5CA9wuM6fMqq7A/8bo46NQ7Bl9L\nnbdY3r7JYZlRJ9PcUas0wLu9516H4x2m8e9UEbC6wHqa2j+5tHppTIdJbqx5Fhij\ny85HvOde2T5QEEKSo2R1RunYn1uIMUOeKpajo5q/0rcgSYxj5KBrKWSp9RA6vJra\n/b4iN5A/AgMBAAECggEAIB27XTEu/RvVit2zJJybqfXN0BtJXK+gaPxmeJSVc+Sb\n9SdmKcohtDvrWfMEYmiNzGSLg5xsRxAqd0U8FHRkYMuPEvpnr9NVmyuSizK0FX7X\nvNJinN+IB5kPuNL1wQz3JDtf0wQmW6twM6xpUCa4uJcXjUeg4iyc9MY+IqolGf1T\npgN/kOg4BWmKsu6ujMcFajKb6PQXEAv+KvHybgb8NsZcWQStGvCTwzbsWk+erYfy\nqttrM5QNietfMYLpS213MErnEwjHdyI2JLfuTcAza7149+e3BfAz24kmiZNOtaa4\nLEQKghOTDAY1IOCYVaDciy+QA1mfqqdEkgEOU3iLWQKBgQDbE5CM0/LTjfHTvFdE\nyj0NXbvvfuMH7RLhHSu7Qhs2FSibG0Gq61SvxTMKC3Nyy/v3PIwHvehV+CIntxb1\n5xD2ZILvdQUMunCAUjWwu0Eo0/Ux3YThI9Hho5qao1yxdi2wAhHZpAU/IQVj02pQ\nUtj1Fb83kloxxsxqeAnFHQ9rWQKBgQDIIjOtY6KZm2zz+tSpviCpoNUKglze1KRS\nLXwRxjkrvb2haXHBQPGCtxp3mwTMmWeOrYNZBUyGXryWrO8cJ5d5G8BjfmJtTgWB\nLVmEqErZ0lpiTdjiD1Cf734AQ9sJH0OKjHVrTuDGOEcsAvsEvD/wyFNaE/+V4g/D\nijy8/DkdVwKBgQCj7i/sMW0zALRETFrBDtRAfDN1Mu2PsMa/zKQ8q2rRPWP1LKAm\n1ZG5NUbL7WWmMR2KE7R01pZUPijQryBvQUhgFzYjGN1+eMRWQS4L4RMRCgogFjKo\nhbU3ssStkjB6WoQ1gFb7FNEYPA1cdYbINDZErtE3NDxpouizgr9M0EIJgQKBgBhL\nrqJZ+h9TswJbbP2+SxDMqZBBCy0x+1DOnMU7ny0kN6Uku96OF8OanufuNcLwzJWR\nkuR3tDaLwbE5BT4RwF2/dLefXCuQ0TJBYyCrnYqb8sUEVlP7L/p6hH1bv3d4CCcF\nrit8w+TMaDd7lSWaBNkiOJwy2VBExU0jtwPqSrS5AoGAXBKNE5T8giizIvW7Pjeb\nZiFNUI9jwB8Y7iNx/Xdkafzbu3WmvRr1X+IsgsHjwjFSaorjyHZnwmsQVUCuqVYV\n9kYGRAphVIHqFiSMgI6ohrcGuJJF11Ky1LMGBCZlsBgqp1TRHuqfNDA9MOy6cbc/\nK/i57S9ku5Whyi2CDGwH4gA=\n-----END PRIVATE KEY-----\n'; // TODO - enter your private key here
	const email = 'keller-app-446@keller-app-25789.iam.gserviceaccount.com'; // TODO - enter your email here
	const projectId = 'keller-app-25789'; // TODO - Enter your project ID here

	var firestore = FirestoreApp.getFirestore(email, key, projectId);

	if (exportData) {
		exportToFirestore(firestore, collectionName, properties, records, sheet);
	} else {
		importFromFirestore(firestore, collectionName, properties, records, sheet);
	}
}

function importFromFirestore(firestore, collectionName, properties, records, sheet) {
	// We import the data from the collection and either do an update or addition. We don't remove records that exist in the sheet but not in Firestore
	firestore.getDocuments(collectionName).forEach(function (data) {
		const splitPath = data.name.split('/');
		const documentId = splitPath[splitPath.length - 1];

		// For some bizarre reason the firstIndex array method wasn't working so I broke down and implemented it with a for loop
		var sheetRowIndex = -1;
		for (i = 0; i < records.length; i++) {
			if (records[i][0] == documentId) {
				sheetRowIndex = i;
				break;
			}
		}

		if (sheetRowIndex < 0) {
			// Doesn't exist so we need to add it to our sheet. I'm being lazy and assume an order
			sheet.appendRow([
				documentId,
				addField(data.fields.name),
				addField(data.fields.description),
				addField(data.fields.projectUrl),
				addField(data.fields.messageForParents),
				addField(data.fields.furtherResources),
				addField(data.fields.category),
				''
			]);
		} else {
			// We've found it so let's update the sheet
			Object.getOwnPropertyNames(data.fields).forEach(function (docProperty, docPropertyIndex) {
				// Iterate through the object properties, find the column and set the data

				// Important you just don't assume a precise match between the order the fields will show up from Firebase
				// and the order of your sheet. Can easily be different
				const headerColumnIndex = properties.indexOf(docProperty);
				if (headerColumnIndex >= 0) {
					// Generate the cell ID i.e. B2 or C6
					const cellId =
						String.fromCharCode('A'.charCodeAt() + headerColumnIndex) + (sheetRowIndex + 2);

					// Set the value
					sheet.setCurrentCell(sheet.getRange(cellId)).setValue(data.fields[docProperty]);
				}
			});
		}
	});
}

function addField(prop) {
	// If I don't do this it will say "undefined" for fields that don't exist
	return prop ? prop : '';
}

function exportToFirestore(firestore, collectionName, properties, records, sheet) {
	var sheetRowIndex = 2;

	records
		.map(function (record) {
			// record: [ (empty), 'My Project' ,'Fun!', 'https://test.me' ,'Hello', 'some extra' ,'Test Category 1' ]
			// props : [ 'id', 'name', 'description', 'projectUrl', 'messageForParents', 'furtherResources', 'category', 'toDelete' ]
			var data = {};
			properties.forEach(function (prop, i) {
				data[prop] = record[i];
			});
			return data;
		})
		.forEach(function (data) {
			const id = data.id;
			const toDelete = data.toDelete;
			delete data.id; // We don't want to store these as values so delete these properties
			delete data.toDelete;

			if (id && toDelete) {
				// Delete this row in Firestore and the sheet
				firestore.deleteDocument(collectionName + '/' + id);
				sheet.deleteRow(sheetRowIndex);
			} else if (id && !toDelete) {
				// Update this document in Firestore
				firestore.updateDocument(collectionName + '/' + id, data);
			} else if (!id && !toDelete) {
				// Create the document in Firestore and then store the ID in the sheet
				var createdRecord = firestore.createDocument(collectionName, data);

				// The name is the full path. The ID is at the end 'projects/<project-id>/databases/(default)/documents/<collection-name>/33ZAD2XNK98JC3HQ4hIl'
				const splitPath = createdRecord.name.split('/');
				if (splitPath.length > 0) {
					sheet
						.setCurrentCell(sheet.getRange('A' + sheetRowIndex))
						.setValue(splitPath[splitPath.length - 1]);
				}
			}

			if (!toDelete) {
				sheetRowIndex++;
			}
		});
}

function getProperties(sheet) {
	return sheet.getRange(1, 1, 1, 8).getValues()[0]; // [ 'id', 'name', 'description', 'projectUrl', 'messageForParents', 'furtherResources', 'category', 'toDelete' ]
}

function getRecords(sheet) {
	var data = sheet.getDataRange().getValues();
	var dataToImport = [];
	for (var i = 1; i < data.length; i++) {
		dataToImport.push(data[i]);
	}
	return dataToImport;
}
