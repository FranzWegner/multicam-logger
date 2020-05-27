"use strict"

const amountOfCams = 4;

const fs = require('fs');

const ioHook = require('iohook');
var keycode = require('keycode');



ioHook.start();


ioHook.start(true);

const startTime = Date.now();

let endOfLastEdlClip = 0;



let cuts = [];




//angle, when pressed
cuts[0] = [1, startTime]

let lastValidLength

function generateEDL(cutsEx) {

    let finalString = '"ID";"Track";"StartTime";"Length";"PlayRate";"Locked";"Normalized";"StretchMethod";"Looped";"OnRuler";"MediaType";"FileName";"Stream";"StreamStart";"StreamLength";"FadeTimeIn";"FadeTimeOut";"SustainGain";"CurveIn";"GainIn";"CurveOut";"GainOut";"Layer";"Color";"CurveInR";"CurveOutR";"PlayPitch";"LockPitch";"FirstChannel";"Channels"';


    let stringA = [];


    for (let i = 1; i < cutsEx.length - 1; i++) {



        let startTime = cutsEx[i][1] - cutsEx[0][1];
        let length = cutsEx[i + 1][1] - cutsEx[i][1];

        let EdlStartTime = edlFrames(msToFrames(startTime));
        let EdlLength = edlFrames(msToFrames(length));

        if (EdlStartTime != endOfLastEdlClip) {

            EdlStartTime = endOfLastEdlClip;

        }

        let EdlEndTime = EdlStartTime + EdlLength;

        for (let j = 1; j < amountOfCams + 1; j++) {

            let subString = "";

            if (j == cutsEx[i][0]) {
                subString += '; 1; ';
            } else {
                subString += '; ' + (j + 1) + '; ';
            }


            subString += EdlStartTime + ".0000; " + EdlLength + ".0000";
            subString += "; 1.000000; FALSE; FALSE; 0; TRUE; FALSE; VIDEO; "
            subString += "U:\\\Cam" + j + ".MP4; 0; "
            subString += EdlStartTime + ".0000; " + EdlLength + ".0000";
            subString += "; 0.0000; 0.0000; 1.000000; 4; 0.000000; 4; 0.000000; 0; -1; 4; 4; 0.000000; FALSE; 0; 0";

            stringA.push(subString);

        }

        endOfLastEdlClip = EdlEndTime;

    }


    for (let i = 1; i < stringA.length; i++) {
        finalString += "\n";
        finalString += i;
        finalString += stringA[i];
    }

    return finalString;

}



ioHook.on('keydown', event => {



    if (event.ctrlKey && event.keycode == 31) {

        saveEDL(cuts, true);

    } else {


        if (cuts.length % 100 == 0) {
            saveEDL(cuts, false);
        }

        handleCameraSwitch(keycode(event.rawcode), Date.now());

    }
});




console.log('Press any key...');

function saveEDL(EDLcuts, wannaTerminate) {

    let currentMoment = new Date().toISOString();
    let currentDay = currentMoment.slice(0, 10);
    let currentTime = currentMoment.slice(10, 19).replace(/:/g, "_");

    let StringToWrite = generateEDL(EDLcuts);

    // this fixes weird beginning of timelines
    endOfLastEdlClip = 0;

    let filename = "" + currentDay + currentTime;

    writeFCPXML(StringToWrite, filename);

    fs.writeFile(filename + ".txt", StringToWrite, (err) => {
        if (err) throw err;
        console.log('Vegas EDL file saved!');
        if (wannaTerminate == true) {
            console.log('FCPXML file saved!')
            process.exit();
        }
    })


}

function handleCameraSwitch(keyString, date) {



    if (keyString != undefined && keyString.startsWith("numpad")) {

        keyString = keyString.split(' ')[1];
    }

    if (keyString == "0") {
        keyString = "keineNummer";
    }

    let cameraAngle = parseInt(keyString);


    if (isNaN(cameraAngle)) {

    } else {


        if (cameraAngle <= amountOfCams) {

            //look how big big cut list is
            let cutsSize = cuts.length;



            cuts.push([cameraAngle, date]);






            console.log("[" + keyString + "] | " + cutsSize + " cuts recorded.")

        }

    }

}

function msToFrames(ms) {
    return Math.round((ms * 50) / 1000);
}

function edlFrames(frames) {
    return frames * 20;
}

const xmlString = {

    endOfSequence: `
    </video>
    <audio />
</media>
</sequence>
</children>
</project>
</xmeml>`,
    startOfSequence: `
    <sequence id="Sequence 1">
    <updatebehavior>add</updatebehavior>
    <name>Sequence 1</name>
    <duration>1800000</duration>
    <rate>
        <ntsc>FALSE</ntsc>
        <timebase>50</timebase>
    </rate>
    <timecode>
        <rate>
            <ntsc>FALSE</ntsc>
            <timebase>50</timebase>
        </rate>
        <frame>180000</frame>
        <source>source</source>
        <displayformat>NDF</displayformat>
    </timecode>
    <in>-1</in>
    <out>-1</out>
    <media>
        <video>
            <format>
                <samplecharacteristics>
                    <width>1920</width>
                    <height>1080</height>
                    <pixelaspectratio>Square</pixelaspectratio>
                    <anamorphic>FALSE</anamorphic>
                    <fielddominance>none</fielddominance>
                    <rate>
                        <ntsc>FALSE</ntsc>
                        <timebase>50</timebase>
                    </rate>
                    <colordepth>24</colordepth>
                </samplecharacteristics>
            </format>`
};


// index of object = track
let clips = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
]



function generateTracksXML(clipItems) {

    let resultXML = "";

    for (let trackIndex in clipItems) {

        resultXML += "<track>";

        for (let clipItemIndex in clipItems[trackIndex]) {


            let currentClipItem = clipItems[trackIndex][clipItemIndex]

            resultXML += `
                            <clipitem>
								<name>${currentClipItem.filename}.MP4</name>
								<duration>356</duration>
								<rate>
									<ntsc>FALSE</ntsc>
									<timebase>0</timebase>
								</rate>
								<in>${currentClipItem.inClip}</in>
								<out>${currentClipItem.outClip}</out>
								<start>${currentClipItem.startTimeline}</start>
								<end>${currentClipItem.outTimeline}</end>
								<pixelaspectratio>Square</pixelaspectratio>
								<anamorphic>FALSE</anamorphic>
								<alphatype>straight</alphatype>
								<masterclipid>${currentClipItem.filename}.MP4</masterclipid>
								<logginginfo>
									<scene />
									<shottake />
									<lognote />
									<good>FALSE</good>
								</logginginfo>
								<labels>
									<label2 />
								</labels>
								<comments>
									<mastercomment1 />
									<mastercomment2 />
									<mastercomment3 />
									<mastercomment4 />
								</comments>
								<file id="${currentClipItem.filename}" />
								<filter>
									<effect>
										<name>Opacity</name>
										<effectid>opacity</effectid>
										<effectcategory>motion</effectcategory>
										<effecttype>motion</effecttype>
										<mediatype>video</mediatype>
										<parameter>
											<name>opacity</name>
											<parameterid>opacity</parameterid>
											<valuemin>0</valuemin>
											<valuemax>100</valuemax>
											<value>100</value>
										</parameter>
									</effect>
								</filter>
								<sourcetrack>
									<mediatype>video</mediatype>
								</sourcetrack>
								<fielddominance>none</fielddominance>
							</clipitem>
            `;

        }

        resultXML += "</track>";

    }

    return resultXML;




}


function parseEdl(edl) {

    let lines = edl.split("\n");

    for (let lineIndex in lines) {
        if (lineIndex > 0) {
            let parameters = lines[lineIndex].split(";")
            let clipItem = {
                track: parseInt(parameters[1].trim()),
                timelineStart: parseInt(parameters[2].trim()),
                timelineDuration: parseInt(parameters[3].trim()),
                filename: parameters[11].trim().slice(3, 7),
                clipIn: parseInt(parameters[13].trim()),
                clipDuration: parseInt(parameters[14].trim())
            }

            addParsedEdlClipToClipObj(clipItem);
        }

    }

}

function addParsedEdlClipToClipObj(clipItem) {
    let returnObj = {
        filename: clipItem.filename,
        inClip: msToFrames(clipItem.clipIn),
        outClip: msToFrames(clipItem.clipIn) + msToFrames(clipItem.clipDuration),
        startTimeline: msToFrames(clipItem.timelineStart),
        outTimeline: msToFrames(clipItem.timelineStart) + msToFrames(clipItem.timelineDuration)
    }

    clips[clipItem.track - 1].push(returnObj);



}


let xmlHeader;

fs.readFile('SampleCut_9Tracks_noTracks.xml', 'utf8', (err, data) => {

    xmlHeader = data;

});

function writeFCPXML(edlData, filename) {


    parseEdl(edlData);

    let xmlStringToSave = xmlHeader + xmlString.startOfSequence + generateTracksXML(clips) + xmlString.endOfSequence;

    // fix duplicating XML clips
    clips = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];

    fs.writeFile(`${filename}.xml`, xmlStringToSave, (err) => {
        if (err) throw err;
        console.log('FCPXML file saved!');
    });


}