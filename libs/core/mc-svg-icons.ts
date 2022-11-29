/* eslint-disable */
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export class McSvgIcons {
  public static register(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_24px.svg'));
    iconRegistry.addSvgIcon(
      'arrow_back_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_arrow_back_white_24px.svg'),
    );
    iconRegistry.addSvgIcon('layers', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_layers_24px.svg'));
    iconRegistry.addSvgIcon(
      'menu_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_menu_white_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'help_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_help_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'help_outline',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_help_outline_24px.svg'),
    );

    iconRegistry.addSvgIcon(
      'help_outline_new',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_help_24px.svg'),
    );

    iconRegistry.addSvgIcon(
      'check_box_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_check_box_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'check_box_outline_blank_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_check_box_outline_blank_black_24px.svg'),
    );

    iconRegistry.addSvgIcon(
      'cancel_black_sm',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_cancel_black_18px.svg'),
    );

    iconRegistry.addSvgIcon(
      'note_green',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_note_green_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'note_add_gray',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_note_add_gray_24px.svg'),
    );

    iconRegistry.addSvgIcon('seguro', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_seguro.svg'));

    iconRegistry.addSvgIcon(
      'settings_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_settings_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'edit_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_mode_edit_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'menu_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_menu_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'add_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'search_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_search_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'close_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'close_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_white_24px.svg'),
    );
    iconRegistry.addSvgIcon('documents', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_documents.svg'));
    iconRegistry.addSvgIcon(
      'delete_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_delete_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'delete_red',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_delete_red_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'home_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_home_white_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'home_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_home_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'pageview_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_pageview_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'pageview_blue',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_pageview_blue_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'pageview_red',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_pageview_red_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'pageview_green',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_pageview_green_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'star_yellow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_star_yellow_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'thumb_down_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_thumb_down_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'thumb_up_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_thumb_up_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'domain_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_domain_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'add_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_white_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'cancel_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_cancel_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'person_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_person_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'assignment_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_assignment_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'arrow_back',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_arrow_back_24px.svg'),
    );
    iconRegistry.addSvgIcon('logout', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_logout_24px.svg'));
    iconRegistry.addSvgIcon('person', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_person_24px.svg'));
    iconRegistry.addSvgIcon('email', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_email_24px.svg'));
    iconRegistry.addSvgIcon('info', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_info_24px.svg'));
    iconRegistry.addSvgIcon(
      'photo_camera',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_photo_camera_24px.svg'),
    );
    iconRegistry.addSvgIcon('block', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_block_24px.svg'));
    iconRegistry.addSvgIcon('lightning', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_lightning.svg'));
    iconRegistry.addSvgIcon('lock', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_lock_24px.svg'));
    iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_close_24px.svg'));
    iconRegistry.addSvgIcon('push_pin', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_push_pin_24px.svg'));
    iconRegistry.addSvgIcon('done_all', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_done_all_24px.svg'));
    iconRegistry.addSvgIcon(
      'clear_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_clear_black_24px.svg'),
    );
    iconRegistry.addSvgIcon('search', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_search_24px.svg'));
    iconRegistry.addSvgIcon(
      'visibility_off',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_visibility_off_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'expand_more',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_expand_more_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'visibility',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_visibility_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'shopping_cart',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_shopping_cart_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'credit_card',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_credit_card_24px.svg'),
    );
    iconRegistry.addSvgIcon('zoom_in', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_zoom_in_24px.svg'));

    iconRegistry.addSvgIcon(
      'view_headline_color',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_view_headline_color_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'filter_list_color',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_filter_list_color_24px.svg'),
    );
    iconRegistry.addSvgIcon('wysiwyg', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_wysiwyg_24px.svg'));
    iconRegistry.addSvgIcon(
      'menu_book',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_menu_book_24px.svg'),
    );
    iconRegistry.addSvgIcon('campaign', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_campaign_24px.svg'));
    iconRegistry.addSvgIcon(
      'file_upload',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_file_upload_24px.svg'),
    );
    iconRegistry.addSvgIcon('paid', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_paid_24px.svg'));
    iconRegistry.addSvgIcon(
      'settings_backup_restore',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_settings_backup_restore_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'file_download',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_file_download_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'description',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_description_24dp.svg'),
    );
    iconRegistry.addSvgIcon('upload', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_upload_24dp.svg'));
    iconRegistry.addSvgIcon(
      'account_balance',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_account_balance_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'manage_accounts',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_manage_accounts_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'exit_to_app_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_exit_to_app_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'content_copy_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_content_copy_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'keyboard_arrow_down_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_keyboard_arrow_down_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'keyboard_arrow_down_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_keyboard_arrow_down_white_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'photo_camera_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_photo_camera_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'photo_camera_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_photo_camera_white_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'chevron_right_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_chevron_right_white_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'chevron_right_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_chevron_right_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'chevron_left_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_chevron_left_black-24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'add_a_photo_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_a_photo_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'attach_file_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_attachment_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'more_horiz_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_more_horiz_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'filter_list_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_filter_list_black_24px.svg'),
    );

    iconRegistry.addSvgIcon(
      'filter_list_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_filter_list_white_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'monetization',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_monetization_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'report_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_report_white_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'view_list_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_view_list_white_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'calculator',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_calculator_24px.svg'),
    );

    iconRegistry.addSvgIcon(
      'add_circle_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_add_circle_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'remove_circle_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_remove_circle_black_24px.svg'),
    );

    iconRegistry.addSvgIcon(
      'store_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_store_white_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'store_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_store_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'email_white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_email_white_24px.svg'),
    );

    iconRegistry.addSvgIcon(
      'arrow_drop_down_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_arrow_drop_down_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'arrow_up_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_arrow_up_black_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'arrow_down_black',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_arrow_down_black_24px.svg'),
    );

    // for order-actions
    iconRegistry.addSvgIcon(
      'construction',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_construction_24px.svg'),
    );
    iconRegistry.addSvgIcon('history', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_history_24px.svg'));
    iconRegistry.addSvgIcon(
      'account_box',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_account_box_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'remove_red_eye',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_remove_red_eye_24px.svg'),
    );
    iconRegistry.addSvgIcon('scanner', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_scanner_24px.svg'));
    iconRegistry.addSvgIcon(
      'cancel_presentation',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_cancel_presentation_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'priority_high',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_priority_high_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'local_printshop',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_local_printshop_24px.svg'),
    );

    iconRegistry.addSvgIcon('build', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_build_24dp.svg'));
    iconRegistry.addSvgIcon(
      'download_thin',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_file_download_thin_24px.svg'),
    );
    iconRegistry.addSvgIcon(
      'message_question',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_message_question_24px.svg'),
    );
  }
}
