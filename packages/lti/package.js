Package.describe({
  summary: "LTI Authentication"
});

/**
 * On use we'll add files and export our tool
 */
Package.on_use(function (api) {

  api.add_files(['lib/lti-auth.js'],'server'); // Can be 'server', 'client' , ['client','server']

  if (typeof api.export !== 'undefined') {
    api.export(['Provider'], 'server');
  }
});