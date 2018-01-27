import IrisDataset from 'ml-dataset-iris';
import ConfusionMatrix from 'ml-confusion-matrix';

describe('xgboost test (WASM)', () => {
  it('basic test on iris dataset', async () => {
    var XGBoostWASM = await require('..');
    var booster = new XGBoostWASM({
      objective: 'multi:softmax'
    });
    var dataset = IrisDataset.getNumbers();
    var trueLabels = IrisDataset.getClasses().map((elem) => IrisDataset.getDistinctClasses().indexOf(elem));

    booster.train(dataset, trueLabels);
    var predictions = booster.predict(dataset);
    var cm = ConfusionMatrix.fromLabels(trueLabels, predictions);

    expect(cm.getF1Score(0)).toBe(1);
    expect(cm.getF1Score(1)).toBe(1);
    expect(cm.getF1Score(2)).toBe(1);

    booster.free();
  });

  it('load and save test', async () => {
    var XGBoostWASM = await require('..');
    var booster = new XGBoostWASM({
      objective: 'multi:softmax'
    });
    var dataset = IrisDataset.getNumbers();
    var trueLabels = IrisDataset.getClasses().map((elem) => IrisDataset.getDistinctClasses().indexOf(elem));

    booster.train(dataset, trueLabels);

    var model = JSON.parse(JSON.stringify(booster));
    booster = XGBoostWASM.load(model);

    var predictions = booster.predict(dataset);
    var cm = ConfusionMatrix.fromLabels(trueLabels, predictions);

    expect(cm.getF1Score(0)).toBe(1);
    expect(cm.getF1Score(1)).toBe(1);
    expect(cm.getF1Score(2)).toBe(1);

    booster.free();
  });
});

