# Multicam Logger

Start the script in terminal (You need [Node.js](https://nodejs.org/en/download/) installed first)

```sh
$ node main
```

Press numbers 1-9 on your keyboard to log your camera switches from your ATEM production switcher, OBS multiview or anything that involves changing camera angles. When you're done press "CTRL + S".

  - import timeline into Davinci Resolve (use the exported .xml) or Vegas Pro (use .txt)
  - for importing into Premiere Pro reexport the xml to a new xml (FCP 7 V5) in Resolve
 
### Full Video Guide: https://www.youtube.com/watch?v=Hpu0Q93Qva8
### Premiere Pro & Resolve Import Tutorial: https://www.youtube.com/watch?v=mdD8W_1shtE

Edit main.js to change your preferred numbers of cameras (any value above will not be logged)
```sh
const amountOfCams = 4;
```
  
# Limitations
- hard cuts only
- no real multicam in Premiere Pro/Resolve
- switches just with keyboard
- logs cuts even when in preview mode
- manual syncing in post
- no markers
(workaround: use extra camera angles to indiciate events)
- nesting is needed
(intentional because I wanted each camera angle to include multiple files)

# Alternatives
* [Multicam Logger by Softron](https://softron.tv/products/multicam-logger) - For Mac only, 1.495€, supports multicam track import to Final Cut Pro and Premiere Pro
* [H2R Logger](https://heretorecord.com/logger/) - For Mac & Windows, supports FCPX & Resolve, currently in closed beta
* [Logger](https://youtu.be/OjZmxuU_glM?t=222) by [@bart_at_work](https://twitter.com/bart_at_work) - Reads switches directly from ATEM, currently not public