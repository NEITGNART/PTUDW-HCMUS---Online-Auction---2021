import {engine} from 'express-handlebars';
import hbs_section from 'express-handlebars-sections';
import numeral from 'numeral';
import moment from 'moment'
import productController from "../controllers/product.controller.js";

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
            },

            getThumbnail(list) {
                return list[0]
            }
            ,
            displayPagination(currentPage, stringQuery, maxPage) {

                const pagination = productController.pagination(currentPage, maxPage);

                let type = Object.keys(stringQuery).map(key => key + '=' + stringQuery[key]).join('&');
                let query = type.replace(/\s/g, '%20');

                console.log("Query" + type);

                let html = '';

                const hrefStart = `?page=${currentPage - 1}&${query}`;

                if (currentPage === 1) {
                } else {
                    html += `<li><a href=${hrefStart}><i class="fa fa-arrow-left" aria-hidden="true"></i></a></li>`;
                }

                // implement a pagination
                for (let i = 0; i < pagination.length; i++) {
                    let href;

                    if (pagination[i] === '...') {
                        let random = Math.floor(Math.random() * (pagination[i + 1] - pagination[i - 1] + 1)) + pagination[i - 1];
                        href = `?page=${random}&${query}`;
                    } else {
                        href = `?page=${pagination[i]}&${query}`;
                    }

                    if (pagination[i] === currentPage) {
                        html += `<li><a href= ${href} class="active">${pagination[i]}</a></li>`;
                    } else {
                        html += `<li><a href=${href}>${pagination[i]}</a></li>`;
                    }
                }
                
                const hrefEnd = `?page=${currentPage + 1}&${query}`;

                if (currentPage === maxPage) {
                } else {
                    html += `<li><a href=${hrefEnd}><i class="fa fa-arrow-right" aria-hidden="true"></i></a></li>`;
                }

                return html;

            }
            ,


        }

    }))
    ;
    app.set('view engine', 'hbs');
    app.set('views', './views');
}