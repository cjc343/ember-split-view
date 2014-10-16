import Ember from 'ember';

export default Ember.Component.extend({
  splitPercentage: Ember.computed.alias('parentView.splitPercentage'),
  sashWidthPercentage: Ember.computed.alias('parentView.sash.widthPercentage'),
  isVertical: Ember.computed.alias('parentView.isVertical'),
  attributeBindings: ['style'],

  childSplitView: null,
  fixedSide: null,
  movableSide: null,

  didInsertElement: function() {
    if(this.get('parentView').addSplit) {
      this.get('parentView').addSplit(this);
    }

    Ember.run.scheduleOnce('afterRender', this, this.updateChildSplitView);
  },

  willDestroyElement: function() {
    this.get('parentView').removeSplit(this);    
  },

  style: function() {
    var s = "position:relative;float:left;";

    if(this.get('isVertical')) {
      s += "height:auto;";
      if (this.get('movableSide')) {
        s += "width:" + this.get('movablePercent') + "%";
      }
    } else {
      s += "width:auto;";
      if (this.get('movableSide')) {
        s += "height:" + this.get('movablePercent') + "%";
      }
    }

    return s;
  }.property('isVertical', 'fixedSide', 'movableSide', 'movablePercent'),

  movablePercent: function() {
    if(!this.get('movableSide')) {
      return;
    }

    if(this.get('movableSide') === "right" || this.get('movableSide') === "bottom") {
      return this.get('splitPercentage') - this.get('sashWidthPercentage') / 2;
    } else {
      return 100 - this.get('splitPercentage') - this.get('sashWidthPercentage') / 2;
    }
  }.property('sashWidthPercentage', 'splitPercentage', 'movableSide'),

  updateChildSplitView: function() {
    var childSplit = this.get('childSplitView');

    if(childSplit) {
      childSplit.set('width', this.$().width());
      childSplit.set('height', this.$().height());
    }
  }.observes('childSplitView', 'movablePercent')
});
