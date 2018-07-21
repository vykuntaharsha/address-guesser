import firebase from './firebase';
import { config } from './config';

const app = firebase.initializeApp(config);

export default app;
