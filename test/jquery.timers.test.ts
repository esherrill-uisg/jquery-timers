

describe('jquery.timers Tests', () => {
  beforeEach(() => {

  });
  it('Timer is defined', () => {
    expect(jQuery.timer).toBeDefined();
  });

  it('Timer has a method "has"', () => {
    expect(jQuery.timer.has).toBeDefined();
  });

  it('There is an extension to jQuery called hasTime', () => {
    expect(jQuery.fn.hasTime).toBeDefined();
  });

  it('hasTime', () => {
    setFixtures('<div id="test-fixture"></div><div id="jasmine"></div>');
    var fixture = jQuery('#test-fixture');
    const lambda: TimerPluginFunction = (counter: number) => { return false; }
    fixture.oneTime(10000, 'oneTimeFunction', lambda);
    fixture.everyTime(10000, 'everyTimeFunction', lambda);

    expect(fixture.hasTime()).toEqual(true);
    expect(fixture.hasTime('oneTimeFunction')).toEqual(true);
    expect(fixture.hasTime('everyTimeFunction')).toEqual(true);

    expect(fixture.hasTime('noTimeFunction')).toEqual(false);

    // Bind noTimeFunction to fixture
    fixture.oneTime(10000, 'noTimeFunction', lambda);

    expect(fixture.hasTime('noTimeFunction')).toEqual(true);

    expect(jQuery('#jasmine').hasTime()).toEqual(false);
    expect(jQuery('#jasmine').hasTime('noName')).toEqual(false);
  });
});
