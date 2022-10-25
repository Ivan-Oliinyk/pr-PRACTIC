import { head } from 'lodash';
import * as NodeGeocoder from 'node-geocoder';
import { config } from 'src/config';
import * as superagent from 'superagent';

export async function getTimeZoneByAddress(address: string): Promise<string> {
  try {
    const googleMapApiKey = config().GOOGLE_MAPS_API_KEY;
    console.log('////////////', googleMapApiKey);
    const options = {
      provider: 'google',
      apiKey: googleMapApiKey,
    };
    const geocoder = NodeGeocoder(options);
    const res: {
      latitude: string;
      longitude: string;
    }[] = await geocoder.geocode(address);
    const data = head(res);
    if (!data) return null;
    const fetchedData = await superagent
      .get(`https://maps.googleapis.com/maps/api/timezone/json`)
      .query({
        location: `${data.latitude},${data.longitude}`,
        key: googleMapApiKey,
        timestamp: Math.round(Date.now() / 1000),
      });
    console.log('////////////////////');
    // console.log(fetchedData);
    console.log(fetchedData.body);
    console.log('////////////////////');

    return fetchedData.body.timeZoneId;
  } catch (e) {
    console.log('////////////////////e');
    console.log(e);
    console.log('////////////////////e');

    return null;
  }
}
