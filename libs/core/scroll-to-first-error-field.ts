const scrollToFirstErrorField = (element: Element) => {
  const errorElement = element.querySelector(':not(form).ng-invalid.ng-touched');
  errorElement?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center',
  });
};

export default scrollToFirstErrorField;
