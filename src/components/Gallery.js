import React, {Component} from 'react';

class Gallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playingUrl: '',
            audio: null,
            playing: false
        }
    }

    playAudio(previewUrl) {
        if(previewUrl){
            let audio = new Audio(previewUrl);
            if (!this.state.playing) {
                audio.play();
                this.setState({
                    playing: true,
                    playingUrl: previewUrl,
                    audio
                });
            } else {
                if(this.state.playingUrl ===previewUrl) {
                    this.state.audio.pause();
                    this.setState({
                        playing: false
                    });
                } else {
                    this.state.audio.pause();
                    audio.play();
                    this.setState({
                        playing: true,
                        playingUrl: previewUrl,
                        audio
                    });
                }
            }
        } else {
            if (this.state.playingUrl) this.state.audio.pause();
            this.setState({
                playing: false
            });
            alert("Audio is not exist!!");
        }
    }
    render() {
        console.log(this.props)
        const { tracks } = this.props;
        console.log(tracks)
        return (
            <div className="gallery">
                {
                    tracks.map((track, k) => {
                        const trackImg = track.album.images[0].url;
                        return (
                            <div
                                key={k}
                                className="album"
                                onClick={() => this.playAudio(track.preview_url)}>
                                <img src={trackImg} className="album-img" alt={track.name}/>
                                <div className="track-play">
                                    <div className="track-play-inner">
                                        {
                                            (this.state.playingUrl === track.preview_url) && (this.state.playing === true)
                                            ?
                                                <span>| |</span>
                                            :
                                                <span>&#9654;</span>
                                        }
                                    </div>
                                </div>
                                <p className="album-text">{track.name}</p>
                            </div>

                        );
                    })
                }

            </div>
        );
    }
}

export default Gallery;