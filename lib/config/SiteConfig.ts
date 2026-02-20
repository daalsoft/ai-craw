export interface SiteConfig {
  site_name: string;
  url: string;
  list_item: string;
  title_selector: string;
  is_modal: boolean;
  detail_selector: string;
  is_infinite_scroll: boolean;
  scroll_container?: string;
  paging_button_tmpl?: string;
  next_group_button?: string;
}
