import { head } from 'lodash';
import * as NodeGeocoder from 'node-geocoder';
import { config } from 'src/config';

export async function getStateByAddress(address: string): Promise<string> {
  try {
    const googleMapApiKey = config().GOOGLE_MAPS_API_KEY;
    console.log('////////////', googleMapApiKey);
    const options = {
      provider: 'google',
      apiKey: googleMapApiKey,
    };
    const geocoder = NodeGeocoder(options);
    const res: {
      administrativeLevels: { level1long: string };
    }[] = await geocoder.geocode(address);
    const data = head(res);
    if (
      !data ||
      !data.administrativeLevels ||
      !data.administrativeLevels.level1long
    )
      return null;
    return data.administrativeLevels.level1long;
  } catch (e) {
    console.log('////////////////////e');
    console.log(e);
    console.log('////////////////////e');

    return null;
  }
}
