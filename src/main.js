////////////////////////////////////////////////////////////////////////
//                           Creations                                //
//                                                                    //  
////////////////////////////////////////////////////////////////////////

import { createClient } from "@supabase/supabase-js";
import { sentences, controlSentences, nonExperimentalNames } from "./objects.js";


/**************************************************************************************/

const randomNumber = Math.random();

let correctKey;
let incorrectKey;

if (randomNumber < 0.5) {
  correctKey = "a";
  incorrectKey = "l";
} else {
  correctKey = "l";
  incorrectKey = "a";
}

/**************************************************************************************/

// Create suffle function - suffles array index randomly
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**************************************************************************************/

const OBJECTS_URL =
  "https://raw.githubusercontent.com/saramff/objects-attributes-images/refs/heads/master";
const NON_EXP_URL =
  "https://raw.githubusercontent.com/saramff/objects-attributes-images/refs/heads/master/object-attributes-images_NonExperimental";
const TOTAL_IMAGES = 48;
const TOTAL_NON_EXP_IMGS = 72;
const TOTAL_CONTROL_IMAGES = 144;

// Create pictures arrays for objects images
const objectsImages = Array.from(
  { length: TOTAL_IMAGES },
  (_, i) => `${OBJECTS_URL}/object-${i + 1}.jpg`
);

// Create pictures arrays for non experimental objects images
const nonExperimentalObjectsImages = Array.from(
  { length: TOTAL_NON_EXP_IMGS },
  (_, i) => `${NON_EXP_URL}/object-${i + 1}.jpg`
);

// Create pictures arrays for control objects images
const controlObjectsImages = Array.from(
  { length: TOTAL_CONTROL_IMAGES },
  (_, i) => `${OBJECTS_URL}/object-${i + 49}.jpg`
);

const objectsExperimental = sentences.map((sentence) => {
  return {
    img: sentence.img,
    correct_response: correctKey,
    case: "experimental",
  }
})

const objectsNonExperimental = nonExperimentalNames.map((nonExperimentalName) => {
  return {
    img: nonExperimentalName.img,
    correct_response: incorrectKey,
    case: "non experimental",
  }
})

// Create a slice of the first 24 elements of controlSentences array (without shuffle)

const controlSentencesSlice = controlSentences.slice(0, 24);

const objectsControlExperimental = controlSentencesSlice.map((control) => {
  return {
    img: control.img,
    correct_response: correctKey,
    case: "control",
  }
})


/**************************************************************************************/

// Shuffle objectsExperimental, objectsNonExperimental & objectsControlExperimental arrays 

shuffle(objectsExperimental);
shuffle(objectsNonExperimental);
shuffle(objectsControlExperimental);


// Create a new array with all of them combined

const allObjectsExperimental = [...objectsExperimental, ...objectsNonExperimental, ...objectsControlExperimental];

// Shuffle allObjectsExperimental

shuffle(allObjectsExperimental);

/**************************************************************************************/

const TOTAL_SENTENCES = 48;

shuffle(sentences);

// New Array with first half with TRUE sentences and second half with FALSE sentences
const sentencesWithResponse = sentences.map((sentence, index) => {
  return {
    img: sentence.img,
    sentence: index < TOTAL_SENTENCES / 2 ? sentence.true : sentence.false,
    correct_response: index < TOTAL_SENTENCES / 2 ? correctKey : incorrectKey
  }
})

// Shuffle sentences with response
shuffle(sentencesWithResponse);


/**************************************************************************************/

// New array with sentences with response & shuffled control sentences

shuffle(controlSentences);

const allSentences = [...sentencesWithResponse, ...controlSentences];
shuffle(allSentences);


/**************************************************************************************/

/* Initialize jsPsych */
let jsPsych = initJsPsych();

/* Create timeline */
let timeline = [];

////////////////////////////////////////////////////////////////////////
//                           Consent                                  //
//                                                                    //  
////////////////////////////////////////////////////////////////////////

let check_consent = (elem) => {
  if (document.getElementById('consent_checkbox').checked) {
    return true;
  }
  else {
    alert("Muchas gracias por su interés en nuestro experimento. Si está listo para participar, por favor, dénos su consentimiento.");
    return false;
  }
  return false;
};

let html_block_consent = {
  type: jsPsychExternalHtml,
  url: "consentA2.html",
  cont_btn: "start_experiment",
  check_fn: check_consent
};
timeline.push(html_block_consent);

// // ////////////////////////////////////////////////////////////////////////
// // //                           Demographic  variables                   //
// // ////////////////////////////////////////////////////////////////////////

/* fullscreen */
timeline.push({
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  message: '<p>Por favor, haga clic para cambiar al modo de pantalla completa.</p>',
  button_label:'Continuar',
  on_finish: function(data){
    var help_fullscreen = data.success;
    jsPsych.data.addProperties({fullscreen: help_fullscreen});
  }
});

var participantName = {
  type: jsPsychSurveyText,
  preamble: 'A continuación, le preguntaremos algunos datos.',
  name: 'participantName',
    button_label:'Continuar',
    questions: [{prompt:'<div>¿Cuál es su nombre y apellidos?<\div>', rows: 1, columns: 2, required: 'true'}],
  data: {
    type:"demo",
    participantName: participantName,
  },
  on_finish: function(data){
    var help_participantName = data.response.Q0;
    jsPsych.data.addProperties({participantName: help_participantName});
  },
  on_load: function() {
    document.querySelector('.jspsych-btn').style.marginTop = '20px'; // Adjust margin as needed
  }
};

timeline.push(participantName);

var centroAsociado = {
  type: jsPsychSurveyText,
  name: 'centroAsociado',
    button_label:'Continuar',
    questions: [{prompt:'<div>¿Cuál es su centro asociado?<\div>', rows: 1, columns: 2, required: 'true'}],
  data: {
    type:"demo",
    centroAsociado: centroAsociado,
  },
  on_finish: function(data){
    var help_centroAsociado = data.response.Q0;
    jsPsych.data.addProperties({centroAsociado: help_centroAsociado});
  },
  on_load: function() {
    document.querySelector('.jspsych-btn').style.marginTop = '20px'; // Adjust margin as needed
  }
};

timeline.push(centroAsociado);

var age = {
  type: jsPsychSurveyText,
    name: 'age',
    button_label:'Continuar',
    questions: [{prompt:'<div>¿Cuántos años tiene?<\div>', rows: 1, columns: 2, required: 'true'}],
  data: {
    type:"demo",
    age: age,
  },
  on_finish: function(data){
    var help_age = data.response.Q0;
    jsPsych.data.addProperties({age: help_age});
  },
  on_load: function() {
    document.querySelector('.jspsych-btn').style.marginTop = '20px'; // Adjust margin as needed
  }
};

timeline.push(age);

var demo2 = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt:'Por favor, seleccione el género con el que se identifica.',
      name: 'gender',
      options: ["masculino", "femenino", "otro", "prefiero no decirlo"],
      required: true,
      horizontal: true
    },
     {
      prompt:'Por favor, seleccione su lengua materna.',
      name: 'language',
      options: ["español", "otro"],
      required: true,
      horizontal: true
    },
  ],
  button_label:'Continuar',
  on_finish: function(data) {
    var help_gender = data.response.gender;
    var help_language = data.response.language;
    jsPsych.data.addProperties({gender: help_gender, language: help_language});
  }
};
timeline.push(demo2);

/************************************************************************************************ */

/* Preload images */
let preload = {
  type: jsPsychPreload,
  images: objectsImages,
};
timeline.push(preload);

let preload2 = {
  type: jsPsychPreload,
  images: nonExperimentalObjectsImages,
};
timeline.push(preload2);

let preload3 = {
  type: jsPsychPreload,
  images: controlObjectsImages,
};
timeline.push(preload3);


/* Fixation trial */
let fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS", // Prevent key press
  trial_duration: 1000, // Fixation duration
  data: {
    task: "fixation",
  },
};

/* Welcome message trial */
let welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Bienvenido al experimento. <br /> </p></p> Pulse la barra espaciadora para comenzar.",
  choices: [' '],
};
timeline.push(welcome);


// /**************************************************************************************/


/* Instructions for sentence presentation */
let instructionsSentencePresentation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>En esta tarea verás una serie de objetos que aparecerán uno a uno en el centro de la pantalla.</p>
    <p>Cuando aparezca el objeto, deberás hacer lo siguiente:</p>
    </p>En algunas ocasiones, el objeto aparecerá y desaparecerá automáticamente. No debes hacer nada más que observarlo atentamente.</p>
    </p></p>
    </p>En otras ocasiones, el objeto vendrá acompañado de una frase relacionada y tendrás que indicar si es o no consistente con el objeto.</p>
    <p>Si la frase es CONSISTENTE, pulse la tecla '${correctKey.toUpperCase()}' (sí).</p>
    <p>Si la frase NO ES CONSISTENTE, pulse la tecla '${incorrectKey.toUpperCase()}' (no).</p>
    <p>Debes estar muy atento a cada objeto, ya que no sabes cuándo te va a aparecer una frase relacionada y cuándo no.</p>
    </p></p>
    <p>Te recomendamos colocar los dedos sobre las teclas ${correctKey.toUpperCase()} y ${incorrectKey.toUpperCase()} durante la tarea para no olvidarlas.</p>
    </p>Por ejemplo: primero te aparece la imagen de una caja abierta. Inmediatamente después, la imagen desaparece y te aparece la siguiente frase: "La caja está cerrada". En este caso, deberás pulsar "NO".</p>
    <br />
    <div>
      <img src='https://raw.githubusercontent.com/saramff/objects-attributes-images/refs/heads/master/Caja.jpg'  class="img-instructions" />
    </div>
    <br />
    <p>Pulsa la barra espaciadora para continuar.<p>
  `,
  choices: [' '],
  post_trial_gap: 500,
};
timeline.push(instructionsSentencePresentation);

/* Create stimuli array for sentence presentation */
let sentenceRecognitionStimuli = allSentences.map((sentence) => {
  if (!sentence.name) {
    return {
      justImgStimulus: `
        <h3 class="sentence"></h3>
        <img class="object-img" src="${sentence.img}">
      `,
      stimulus: `
        <h3 class="sentence">${sentence.sentence}</h3>
        <img class="object-img" src="${sentence.img}">
        <div class="keys">
          <p class="${correctKey === 'a' ? 'left' : 'right'}">SÍ</p>
          <p class="${correctKey === 'a' ? 'right' : 'left'}">NO</p>
        </div>
      `,
      correct_response: sentence.correct_response,
      stimulus_duration: null,
      justIMg_duration: 2000,
    };
  } else {
    return {
      justImgStimulus: `
        <h3 class="sentence"></h3>
        <img class="object-img" src="${sentence.img}">
      `,
      stimulus: "",
      correct_response: null,
      stimulus_duration: 0,
      justIMg_duration: 3000,

    }
  }
});

/* Just Image trial */
let justImg = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: jsPsych.timelineVariable("justImgStimulus"),
  choices: "NO_KEYS", // Prevent key press
  trial_duration: jsPsych.timelineVariable("justIMg_duration"), // just image duration
};

/* Sentences presentation trial */
let testSentences = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: jsPsych.timelineVariable("stimulus"),
  choices: ['a', 'l'],
  trial_duration: jsPsych.timelineVariable("stimulus_duration"),
  data: {
    task: "response sentences test",
    correct_response: jsPsych.timelineVariable("correct_response"),
  },
  on_finish: function (data) {
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      data.correct_response
    );
    data.correct_response_meaning = correctKey === data.correct_response ? "YES" : "NO";
  },
};

/* Test procedure: fixation + sentences presentation */
let testSentencesProcedure = {
  timeline: [fixation, justImg, testSentences],
  timeline_variables: sentenceRecognitionStimuli,
  randomize_order: true, // Randomize sentences order
};
timeline.push(testSentencesProcedure);


/**************************************************************************************/


/* Instructions for Tetris */
let instructionstetris = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Ahora jugarás al Tetris durante aproximadamente 20 minutos.</p>
    <p>En Tetris, hay piezas de diferentes formas que caen desde la parte superior de la pantalla. <br /> Tu objetivo es moverlas y girarlas para que encajen y formen líneas horizontales completas. <br /> Cuando una línea se completa, desaparece. <br /> Si las piezas se acumulan hasta llegar a la parte superior, pierde.</p> <p>Controles:</p> <strong>Flecha izquierda:</strong> Mueve la pieza a la izquierda <br /> <strong>Flecha derecha:</strong> Mueve la pieza a la derecha <br /> <strong>Flecha arriba:</strong> Gira la pieza <br /> <strong>Flecha abajo:</strong> Acelera la caída <p>Cuando aparezca la pantalla del juego, haz clic en <strong>"Play"</strong> para iniciar.</p> <p>Si pierdes, selecciona <strong>"Try again"</strong> para reiniciar. <br /> Jugarás de esta manera hasta que se agote el tiempo.</p> <p>Pulsa la barra espaciadora para comenzar.</p>
  `,
  choices: [' '],
  post_trial_gap: 500,
};
timeline.push(instructionstetris);

/* Tetris */
let tetris = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div class="tetris-visible"></div>
  `,
  post_trial_gap: 500,
  choices: "NO_KEYS", // Prevent key press
  trial_duration: 120, 
};
timeline.push(tetris);


/**************************************************************************************/


/* Instructions for objects experimental images presentation */
let instructionsObjectsImgPresentation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>Ahora realizarás la siguiente tarea:</p>
    <p>Si has visto antes el objeto, pulsa la tecla '${correctKey.toUpperCase()}' (presente).</p>
    <p>Si no has visto antes el objeto, pulsa la tecla '${incorrectKey.toUpperCase()}' (no presente).</p>
    <p>De nuevo, te recomendamos colocar los dedos sobre las teclas ${correctKey.toUpperCase()} y ${incorrectKey.toUpperCase()} durante la tarea para no olvidarlas.</p>
    <p>Pulsa la barra espaciadora para comenzar.</p>
  `,
  choices: [' '],
  post_trial_gap: 500,
};
timeline.push(instructionsObjectsImgPresentation);

/* Create stimuli array for objects experimental images presentation */
let objectsExperimentalRecognitionStimuli = allObjectsExperimental.map((objExperimental) => {
  return {
    stimulus: `
      <img class="object-img" src="${objExperimental.img}">
      <div class="keys">
        <p class="${correctKey === 'a' ? 'left' : 'right'}">PRESENTE</p>
        <p class="${correctKey === 'a' ? 'right' : 'left'}">NO PRESENTE</p>
      </div>
    `,
    correct_response: objExperimental.correct_response,
    case: objExperimental.case
  };
});

/* Objects experimental images presentation trial */
let testObjectsExperimentalImg = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: jsPsych.timelineVariable("stimulus"),
  choices: ['a', 'l'],
  data: {
    task: "response objects experimental images test",
    type: jsPsych.timelineVariable("case"),
    correct_response: jsPsych.timelineVariable("correct_response"),
  },
  on_finish: function (data) {
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      data.correct_response
    );
    data.correct_response_meaning = correctKey === data.correct_response ? "PRESENTE" : "NO PRESENTE";
  },
};

/* Test procedure: fixation + objects experimental images presentation */
let testObjectsExperimentalImgProcedure = {
  timeline: [fixation, testObjectsExperimentalImg],
  timeline_variables: objectsExperimentalRecognitionStimuli,
  randomize_order: true, // Randomize objects Img order
};
timeline.push(testObjectsExperimentalImgProcedure);


/**************************************************************************************/


const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_API_KEY
);

const TABLE_NAME = "experimento_objetos_atributos_perceptual_img_jdg";

async function saveData(data) {
  console.log(data);
  const { error } = await supabase.from(TABLE_NAME).insert({ data });

  return { error };
}

const saveDataBlock = {
  type: jsPsychCallFunction,
  func: function() {
    saveData(jsPsych.data.get())
  },
  timing_post_trial: 200
}

timeline.push(saveDataBlock);



/**************************************************************************************/


/* Goodbye message trial */
let goodbye = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Muchas gracias por haber realizado el experimento. <br /> </p></p> Pulsa la barra espaciadora para salir.",
  choices: [' '],
};
timeline.push(goodbye);


// /**************************************************************************************/



/* Run the experiment */
jsPsych.run(timeline);

// Uncomment to see the results on the console (for debugging)
// console.log(jsPsych.data.get());