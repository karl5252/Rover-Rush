import Controls from './Controls';
import Joystick from './Joystick';

class ControlsFactory {
  static createControls(scene) {
    if (scene.sys.game.device.os.android || scene.sys.game.device.os.iOS) {
      return new Joystick(scene);
    } else {
      return new Controls(scene);
    }
  }
}

export default ControlsFactory;
