export class CreateXmlVm {
    /*生成xml地图*/
    xmlSiteMap: boolean;

    /*xml文件名*/
    xmlFileName: boolean;

    /*只包括最近的文章(1000以内)*/
    postLimit1000: boolean;

    /*当发布文章时更新sitemap*/
    updateWhenPost: boolean;

    /*链接包括：文章*/
    postSelect: boolean;

    /*链接包括：页面*/
    pageSelect: boolean;
}
