import React, { Component } from 'react';
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker,
	Polyline
} from 'react-google-maps';
import './map.css';

const MapWithAMarker = withScriptjs(
	withGoogleMap(({ click, userPosition, addressPosition }) => {
		return (
			<GoogleMap
				defaultZoom={10}
				options={{
					styles: [
						{
							elementType: 'labels',
							stylers: [
								{
									visibility: 'off'
								}
							]
						},
						{
							featureType: 'administrative.land_parcel',
							stylers: [
								{
									visibility: 'off'
								}
							]
						},
						{
							featureType: 'administrative.neighborhood',
							stylers: [
								{
									visibility: 'off'
								}
							]
						}
					]
				}}
				onClick={click}
				defaultCenter={{ lat: 47.6062095, lng: -122.3320708 }}>
				<Marker
					animation={window.google.maps.Animation.DROP}
					position={userPosition}
					visible
				/>
				<Marker
					position={addressPosition}
					visible
					icon="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
					animation={window.google.maps.Animation.BOUNCE}
				/>
				{userPosition && addressPosition ? (
					<Polyline path={[userPosition, addressPosition]} />
				) : (
					''
				)}
			</GoogleMap>
		);
	})
);

class Map extends Component {
	state = {
		userPosition: null,
		marked: false,
		address: null,
		difference: null
	};
	componentDidMount() {
		this.get();
	}

	get() {
		const rand = Math.floor(Math.random() * 148648) + 1;

		fetch(
			`https://gisdata.kingcounty.gov/arcgis/rest/services/OpenDataPortal/property__parcel_address_area/MapServer/1722/query?outFields=*&returnGeometry=true&resultOffset=${rand}&resultRecordCount=1&f=json&where=ADDR_NUM+IS+NOT+NULL`
		)
			.then(res => res.json())
			.then(data =>
				this.setState({
					address: {
						full: data.features[0].attributes.ADDR_FULL,
						lat: data.features[0].attributes.LAT,
						lng: data.features[0].attributes.LON
					}
				})
			)
			.catch(e => console.log(e));
	}

	RADII = {
		km: 6371,
		mile: 3960,
		meter: 6371000,
		nmi: 3440
	};

	toRad = num => {
		return (num * Math.PI) / 180;
	};

	haversine(start, end, options) {
		options = options || {};

		var R =
			options.unit in this.RADII
				? this.RADII[options.unit]
				: this.RADII.km;

		var dLat = this.toRad(end.lat - start.lat);
		var dLon = this.toRad(end.lng - start.lng);
		var lat1 = this.toRad(start.lat);
		var lat2 = this.toRad(end.lat);

		var a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLon / 2) *
				Math.sin(dLon / 2) *
				Math.cos(lat1) *
				Math.cos(lat2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		if (options.threshold) {
			return options.threshold > R * c;
		}

		return R * c;
	}

	handleClick = e => {
		this.setState({
			userPosition: e.latLng
		});
	};

	handleMark = () => {
		const difference = this.haversine(
			{
				lat: this.state.userPosition.lat(),
				lng: this.state.userPosition.lng()
			},
			{
				lat: this.state.address.lat,
				lng: this.state.address.lng
			}
		);
		this.setState({ marked: true, difference }, () => {
			setTimeout(() => {
				this.props.handleScore(this.getScore(difference));
			}, 2000);
		});
	};

	getScore(difference) {
		if (difference < 0.25) {
			return 0;
		} else if (difference < 1) {
			return -2;
		} else if (difference < 2.5) {
			return -7;
		} else if (difference < 5) {
			return -1.2;
		} else if (difference < 10) {
			return -20;
		} else {
			return -30;
		}
	}

	render() {
		if (!this.state.address)
			return <main className="map">loading map</main>;
		const addressLatLong = this.state.address
			? {
					lat: this.state.address.lat,
					lng: this.state.address.lng
			  }
			: null;

		return (
			<main className="map">
				<div className="address-details">
					<p>{this.state.address.full}</p>
					<button className="mark-btn" onClick={this.handleMark}>
						Mark
					</button>
					<p>
						difference -
						{this.state.difference ? this.state.difference : ''}
					</p>
				</div>

				<MapWithAMarker
					googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCSkEkXvWawxJYefekeIlOSkBWqTAVDN-s"
					loadingElement={<div style={{ height: `100%` }} />}
					containerElement={<div style={{ height: `70vh` }} />}
					mapElement={<div style={{ height: `100%` }} />}
					userPosition={this.state.userPosition}
					addressPosition={this.state.marked ? addressLatLong : null}
					click={this.handleClick}
				/>
			</main>
		);
	}
}

export default Map;
