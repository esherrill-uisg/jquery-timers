/* !Has */
QUnit.test('hasTime', function()
{
  QUnit.ok(jQuery.timer, 'Timer is defined');
  QUnit.ok(jQuery.timer.has, 'Timer has a method "has"');
  QUnit.ok(jQuery.fn.hasTime, 'There is an extension to jQuery called hasTime');
  
  var fixture = jQuery('#qunit-fixture');
  var lambda = function()
  {}
  
  fixture.oneTime(10000, 'oneTimeFunction', lambda);
  fixture.everyTime(10000, 'everyTimeFunction', lambda);
  
  QUnit.ok(fixture.hasTime(), 'Unnamed timers were found');
  QUnit.ok(fixture.hasTime('oneTimeFunction'), 'Named oneTime function was found');
  QUnit.ok(fixture.hasTime('everyTimeFunction'), 'Named everyTime function was found');
  
  QUnit.strictEqual(false, fixture.hasTime('noTimeFunction'), 'noTimeFunction key should not exist');
  
  // Bind noTimeFunction to fixture
  fixture.oneTime(10000, 'noTimeFunction', lambda)
  QUnit.ok(fixture.hasTime('noTimeFunction'), 'Now the noTimeFunction should exist');
  
  QUnit.strictEqual(false, jQuery('#qunit').hasTime(), 'There should be no timers for #qunit');
  QUnit.strictEqual(false, jQuery('#qunit').hasTime('noName'), 'There should be no timers with labels for #qunit');
});