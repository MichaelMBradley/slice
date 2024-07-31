import './style.css'
import init, { greet } from 'logic';

(async () => {
	await init();
	greet();
})();
