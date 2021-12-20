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
            },

            getThumbnail(list) {
                return list[0]
            },

            displayPagination(currentPage, maxPage) {


                if (currentPage <= 5) {


                    let res = "";

                    if (currentPage == 1 || currentPage == 0)
                        res += `<li>
                          <a class="btn-disable"><i class="fa fa-arrow-left" aria-hidden="true"></i></a>
                            </li>`
                    else {
                        res += `<li>
                          <a href="?page=1" class=""><i class="fa fa-arrow-left" aria-hidden="true"></i></a>
                            </li>`
                    }

                    console.log(currentPage);

                    for (let i = 1; i < 5; ++i) {
                        if (i === +currentPage) {
                            res += `
                                 <li>
                                    <a href="?page=${i}" class="active"> ${i} </i></a>
                                </li>
                            `
                        }
                        else {
                            res += `
                            <li>
                             <a href="?page=${i}">${i}</i></a>
                            <li>`
                        }
                    }
                    res += ` <li>
                    <a href="${currentPage + 1}"><i class="fa fa-arrow-right" aria-hidden="true"></i></a>
                   </li>`

                    return res;

                }

                if (currentPage > 5 && currentPage + 5 < maxPage) {

                    return `
                    
                        <li>
                        <a href="?page={1}"><i class="fa fa-arrow-left" aria-hidden="true"></i></a>
                        </li>
                        <li>

                        <li>
                         <a href="?page=${currentPage - 1}">${currentPage - 1}</i></a>
                         </li>
                        <li>

                        <li>
                         <a href="?page=${currentPage - 2}">${currentPage - 2}</i></a>
                         </li>
                        <li>


                        <li>
                         <a href="?page=?page=${currentPage - 1}">${currentPage - 1}</i></a>
                         </li>
                        <li>


                        <li>
                        <a href="${currentPage}" class="active">${currentPage}</i></a>
                        </li>
                       <li>


                       <li>
                        <a href="?page=${currentPage + 1}" class="active">${currentPage + 1}</i></a>
                        </li>
                       <li>
                        
                       <li>
                        <a href="?page=${currentPage + 2}" class="active">${currentPage + 2}</i></a>
                        </li>
                       <li>
                         <li>
                         <a href="?page=${currentPage + 1}"><i class="fa fa-arrow-right" aria-hidden="true"></i></a>
                        </li>`
                } else {

                }


            }

        }

    }));
    app.set('view engine', 'hbs');
    app.set('views', './views');
}