import uPositionSet from './positionset.js';
import uTrack from './track.js';
import uUser from './user.js';
import { lang as $ } from './initializer.js';
import uAlert from './alert.js';

/**
 * Set of positions representing user's track
 * @class uQuickLink
 * @property {string} token quick link public token
 */
export default class uQuicklink{

  /**
   * @param {uState} state
   */
  constructor(state) {
    this.state = state;
  }

  /**
   * @return {uQuicklink}
   */
  init() {
    this.token = new URL(window.location.href).searchParams.get("ql");
    if(this.token){
      this.state.jobStart()
      this.fetchPositions()
        .then((track) => this.setTrack(track))
        .finally(() => this.state.jobStop())
    }
    return this;
  }

   /**
   * Fetch track positions from quick link public token
   * @return {Promise<void, Error>}
   */
  fetchPositions() {
    if(!this.token){
      return null;
    }
    const params = {
      ql: this.token,
    };
    return uPositionSet.fetch(params).then((_positions) => {
        if (_positions.length) {
          this.state.currentQuickLink = this
          const user = new uUser(_positions[0].userid,_positions[0].username)
          const track = new uTrack(_positions[0].trackid, _positions[0].trackname, user);
          track.fromJson(_positions);
          return track;
        }
        uAlert.error(`${$._('quicklinktokennotfound')}`);
        this.state.currentQuickLink = null
        return null;
    });
  }

  setTrack(track){
    this.state.currentTrack = track;
  }
}