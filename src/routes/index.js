import UserRoute from "../routes/UserRoute.js";
import fanRoute from "../routes/fan.route.js";

let routes = (app ) => {
    app.use('/api/user', UserRoute);
     app.use('/api/fanroute', fanRoute);
};
export default routes ; 