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

            highlightCategory(category, pickedCategory) {
                if (category === pickedCategory) {
                    return 'active-category';
                }
                return '';
            },

            getThumbnail(list) {
                return list[0]
            }
            ,
            displayPagination(currentPage, stringQuery, maxPage, totalItems) {

                console.log("Total display: ", totalItems);

                if (totalItems === 0) {
                    return `
                        <div>
                        
                        <div class="h1 text-sm-center" style="font-size: 1.6rem"> Để tìm được kết quả chính xác hơn, bạn vui lòng:</div>
                        <ul>
                        <li style="list-style: outside">Kiểm tra lỗi chính tả của từ khóa đã nhập</li>
                        <li style="list-style: outside">Thử lại bằng từ khóa khác</li>
                        <li style="list-style: outside">Thử lại bằng những từ khóa tổng quát hơn</li>
                        <li style="list-style: outside">Thử lại bằng những từ khóa ngắn gọn hơn</li>
                        </ul>
                        </div>
                        
                        `
                }

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
            , checkLimit(limit) {
                let html = '';
                if (limit === 12) {
                    html += `<option selected value="1">12 sản phẩm</option>`
                } else {
                    html += `<option value="1">12 sản phẩm</option>`
                }
                if (limit === 9) {
                    html += `<option selected value="2">9 sản phẩm</option>`
                } else {
                    html += `<option value="2">9 sản phẩm</option>`
                }
                if (limit === 6) {
                    html += `<option selected value="3">6 sản phẩm</option>`
                } else {
                    html += `<option value="3">6 sản phẩm</option>`
                }
                return html;
            },
            checkSort(sort) {

                let html = '';

                // if sort is null
                if (sort === null) {
                    html += `<option selected value="0">Mặc định</option>`
                } else {
                    html += `<option value="0">Mặc định</option>`
                }
                if (sort === "currentPrice") {
                    html += `<option selected value="1">Giá tăng dần</option>`
                } else {
                    html += `<option value="1">Giá tăng dần</option>`
                }
                if (sort === "expDate") {
                    html += `<option selected value="2">Thời gian giảm dần</option>`
                } else {
                    html += `<option value="2">Thời gian giảm dần</option>`
                }
                return html;


            }


        }

    }))
    ;
    app.set('view engine', 'hbs');
    app.set('views', './views');
}