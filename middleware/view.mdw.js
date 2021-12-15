import {
    engine
} from 'express-handlebars';
import hbs_section from 'express-handlebars-sections';
import numeral from 'numeral';
import moment from 'moment'

export default (app) => {
    app.engine('hbs', engine({
        extname: '.hbs',
        defaultLayout: 'layout.hbs',
        helpers: {
            format_number(val) {
                return numeral(val).format('0.0');
            },
            section: hbs_section(),
            format_date(text) {
                return moment(text).format("HH:mm:ss')");
            }
        }

    }));

    app.set('view engine', 'hbs');
    app.set('views', './views');
}