// ----------------- FIREBASE CONFIG ---------------
const firebaseConfig = {
    apiKey: "AIzaSyC9ttADyEm-cfPb__joYv3MgBGjWOkxwMc",
    authDomain: "amy--app.firebaseapp.com",
    databaseURL: "https://amy--app.firebaseio.com",
    projectId: "amy--app",
    storageBucket: "amy--app.appspot.com",
    messagingSenderId: "344535742053",
    appId: "1:344535742053:web:a3298943d3d6171f0af88c"
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
 * Listen to an assignment belonging to a student (the assignment was made via the `/v2.0/amy/create-student-assignment` api)
 * @param {*} assignmentId the assignment Id returned by the api
 * @param {*} studentId the userId returned when `/v2.0/auth/create-student-token` or `create-student` was called
 * @param onChange onChange(assignmentSnap, bubblesSnap) function that is called when the assignemtn or bubble changes
 * @return callback that stops the firebase realtime listners
 */
function loadAssignment(assignmentId, studentId, onChange) {
    // Assignemnt and Bubble snaps for current assignment
    let assignmentSnap;
    let bubbleSnaps;

    // generate random assignmentId
    const assignmentReference = assignmentCollection.doc(assignmentId);

    // listen to assignment changes
    const stopAssignment = assignmentReference.onSnapshot(_assignmentSnap => {
        assignmentSnap = _assignmentSnap;
        onChange(assignmentSnap, bubbleSnaps);
    });

    // listent to bubble changes for the assignment
    const stopBubbles = bubbleCollection
        .orderBy("createdAt", "asc")
        .where("studentAssignmentId", "==", assignmentId)
        .where("studentId", "==", studentId)
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
