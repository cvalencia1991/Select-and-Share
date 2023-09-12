import axios from 'axios';


const form = document.querySelector('form')!;
const addresInput = document.getElementById('address')! as HTMLInputElement;


type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number, lng: number } } }[]
    status: 'OK' | 'ZERO_RESULTS'
};

// declare var google: any;

form.addEventListener('submit', (event: Event) => {
    event.preventDefault();
    const enteredAddress = addresInput.value;
    console.log(enteredAddress)
    // send this to Gooogle's API!
    axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress)}A&key=${process.env.GOOGLE_API_KEY}`).then(response => {
            console.log(response)
            if (response.data.status !== 'OK') {
                throw new Error('Could not fetch location!')
            }
            const coordinates = response.data.results[0].geometry.location;
            const map = new google.maps.Map(document.getElementById("map") as HTMLDivElement, {
                center: coordinates,
                zoom: 16,
            });
            new google.maps.Marker({ position: coordinates, map })

        })
        .catch((err) => {
            console.log(err.message)
        })

})

const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&callback=initMap`;
document.body.appendChild(script);
