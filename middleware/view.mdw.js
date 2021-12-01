import {
    engine
} from 'express-handlebars';
import hbs_section from 'express-handlebars-sections';
import numeral from 'numeral';

export default (app) => {
    app.engine('hbs', engine({
        defaultLayout: 'main.hbs',
        helpers: {
            format_number(val) {
                return numeral(val).format('0.0');
            },
            section: hbs_section()
        }
    }));
    app.set('view engine', 'hbs');
    app.set('views', './views');
}