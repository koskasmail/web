<a name="topage"></a>

# winamp

* webamp.bundle.min.js
   *  https://unpkg.com/webamp@1.4.2/built/webamp.bundle.min.js
*  github - webamp
   *  https://github.com/captbaritone/webamp

#### html
```
<div id="app" style="height: 100vh"></div>
<script src="https://unpkg.com/webamp@1.4.2/built/webamp.bundle.min.js"></script>
<div id="app" style="height: 100vh"></div>
<script src="https://unpkg.com/webamp@1.4.2/built/webamp.bundle.min.js"></script>

```

### js
```
const Webamp = window.Webamp;
const webamp = new Webamp({
  initialTracks: [
    {
      metaData: {
        artist: "Quincy Larson",
        title: "Scratching The Surface",
      },
//      url: "https://cdn.jsdelivr.net/gh/captbaritone/webamp@43434d82cfe0e37286dbbe0666072dc3190a83bc/mp3/llama-2.91.mp3",
        url: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
      duration: 5.322286,
    },
    {
      metaData: {
        artist: "Some Artist",
        title: "Title of Second Track",
      },
      ///url: "https://cdn.jsdelivr.net/gh/captbaritone/webamp@43434d82cfe0e37286dbbe0666072dc3190a83bc/mp3/llama-2.91.mp3",
      url: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
      duration: 5.322286,
    },
  ],
});

webamp.renderWhenReady(document.getElementById("app"));
```


----

<p align="right">(<a href="#topage">back to top</a>)</p>
<br/>
<br/>
