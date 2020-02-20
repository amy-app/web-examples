// ----------------- FIREBASE CONFIG ---------------
const firebaseConfig = {
    apiKey: "AIzaSyDJ20dFy6oeNt3uF_URIBD5lllZs-l0b6o",
    projectId: "amy-ac",
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig, "AMY");
const assignmentCollection = app.firestore().collection("StudentAssignments");
const bubbleCollection = app.firestore().collection("ExerciseBubbles");

/**
 * Authenticates a user via a firebase token
 * and returns the user object.
 * You get the token via the following api
 * https://learn-dev1-amy-app.firebaseapp.com/__/api/#/Auth/get_auth_v1_0_generate_user_token
 *
 * @param token firebase token string
 * @return firebase user object
 */
async function authViaToken(token) {
    return app.auth().signInWithCustomToken(token);
}

/**
 * Creates an assignment based on assignment options
 * @param assignmentOptions assignment config object
 * @param onChange onChange(assignmentSnap, bubblesSnap) function that is called when the assignemtn or bubble changes
 * @return callback that stops the firebase realtime listners
 */
function createAssignment(assignmentOptions, onChange) {
    // Assignemnt and Bubble snaps for current assignment
    let assignmentSnap;
    let bubbleSnaps;

    // generate random assignmentId
    const assignmentReference = assignmentCollection.doc();
    const assignmentId = assignmentReference.id;

    // create assignment
    assignmentReference.set(assignmentOptions);

    // listen to assignment changes
    const stopAssignment = assignmentReference.onSnapshot(_assignmentSnap => {
        assignmentSnap = _assignmentSnap;
        onChange(assignmentSnap, bubbleSnaps);
    });

    // listent to bubble changes for the assignment
    const stopBubbles = bubbleCollection
        .orderBy("createdAt", "asc")
        .where("studentAssignmentId", "==", assignmentId)
        .where("studentId", "==", assignmentOptions.studentId)
        .onSnapshot(_bubbleSnaps => {
            bubbleSnaps = _bubbleSnaps;
            onChange(assignmentSnap, bubbleSnaps);
        });

    return () => {
        stopAssignment();
        stopBubbles();
    };
}

/**
 * Creates an assignment based on assignment options
 * @param assignmentOptions assignment config object
 * @param onChange onChange(assignmentSnap, bubblesSnap) function that is called when the assignemtn or bubble changes
 * @return callback that stops the firebase realtime listners
 */

/**
 * Creates an assignment based on assignment options and token
 *
 *
 * @param {*} assignmentOptions assignment config object
 * @param {*} token firebase token
 * @param {*} onChange onChange(assignmentSnap, bubblesSnap) function that is called when the assignemtn or bubble changes
 * @return Promise<stopEvent> Calling the stopEvent() will stop all listeners
 */
async function startAssignment(assignmentOptions, token, onChange) {
    return authViaToken(token).then(student => {
        const studentId = student.user.uid;
        return createAssignment({ ...assignmentOptions, studentId }, onChange);
    });
}

/**
 * Tell AMY what option in what bubble was selecte
 * @param {*} selectedPath The path is the "ID" of an option
 * @param {*} bubbleId the ID on the bubble in which the option is
 */
function clickOption(selectedPath, bubbleId) {
    // set the path/option so AMY can update the data
    // and tell you if your selection was in/correct
    bubbleCollection.doc(bubbleId).update({
        selectedPath,
    });
}

/**
 * Helper function that tests if an assignment exist and has bubbles
 * @param {*} assignmentSnap
 * @param {*} bubbleSnaps
 */
function isAssignmentLoaded(assignmentSnap, bubbleSnaps) {
    if (!assignmentSnap || !bubbleSnaps) {
        return false;
    }

    if (!assignmentSnap.exists) {
        return false;
    }

    if (!assignmentSnap.get("exercises") || assignmentSnap.get("exercises").length === 0) {
        return false;
    }

    if (bubbleSnaps.length === 0) {
        return false;
    }

    return true;
}
