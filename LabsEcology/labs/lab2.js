import nj from 'https://cdn.jsdelivr.net/npm/@d4c/numjs/build/module/numjs.min.js';
export function lab2() {
    let TempXmax = Number(document.querySelector("#tempXmax").value);
    let TempXhyzm = Number(document.querySelector("#tempXhyzm").value);
    let PressXmax = Number(document.querySelector("#pressXmax").value);
    let PressXhyzm = Number(document.querySelector("#pressXhyzm").value);
    let length = 242
    let speed = 0.6
    let TempCorArr = [46, 42, 30, 18, 7, 1, 0]
    let PressCorArr = [23, 22, 15, 7, 2, 0]

    let RandProcArr = [145, 117, 122, 118, 120, 110, 112, 111, 115, 96, 116, 100, 119, 120, 117, 119,
        116, 130, 120, 125, 126, 113, 101, 111, 105, 100, 105, 95, 103, 93, 101, 75, 94,
        91, 93, 77, 77, 105, 80, 102, 96, 102, 97, 101, 98, 100, 96, 110, 113, 108, 113,
        95, 98, 97, 111, 96, 108, 98, 99, 95, 100, 100, 107, 80, 83, 74, 102, 93, 78,
        97, 100, 97, 103, 104, 99, 104, 126, 73, 101, 93, 99, 96, 95, 75, 87, 81, 82,
        76, 80, 77, 82, 83, 78, 81, 78, 82, 83, 74, 80, 83, 80, 84, 79, 82, 80, 73, 76, 77, 74, 76,
        75, 82, 80, 78, 79, 77, 78, 99, 78, 76, 92, 104, 97, 102, 87, 100, 88, 101, 91, 92, 101,
        92, 93, 88, 104, 88, 90, 91, 87, 88, 75, 88, 102, 97, 79, 104, 81, 83, 75, 82, 78, 80, 81, 73,
        84, 70, 82, 71, 79, 82, 77, 78, 73, 61, 63]

    let ordin = CalcOrdin();
    document.querySelector("#kxp").innerHTML = CalcKx(PressCorArr, PressXmax, PressXhyzm);
    document.querySelector("#pcorArr").innerHTML = PressCorArr;
    document.querySelector("#kxt").innerHTML = CalcKx(TempCorArr, TempXmax, TempXhyzm);
    document.querySelector("#tcorArr").innerHTML = TempCorArr;
    document.querySelector("#riseKx0").innerHTML = CalcRiseKx()[0];
    document.querySelector("#declineKx0").innerHTML = CalcDeclineKx()[0];
    document.querySelector("#riseKx1").innerHTML = CalcRiseKx()[1];
    document.querySelector("#declineKx1").innerHTML = CalcDeclineKx()[1];
    document.querySelector("#valSampStep").innerHTML = ValSampStep().toFixed(2);
    document.querySelector("#randProcArrL").innerHTML = RandProcArr.length;
    document.querySelector("#speed").innerHTML = speed;
    document.querySelector("#timeCrossN").innerHTML = TimeCrossN().toFixed(2);
    document.querySelector("#numCroosProc").innerHTML = NumCroosProc().toFixed(2);
    document.querySelector("#mxline").innerHTML = CalrMathExpectation(RandProcArr).toFixed(2);
    document.querySelector("#dispersion").innerHTML = calculateDispersion(RandProcArr).toFixed(2);
    document.querySelector("#ordin").innerHTML = ordin.slice(0, ordin.length / 2) + "</br>" + ordin.slice(ordin.length / 2);
    document.querySelector("#randCorrKx").innerHTML = CalcRandCorrKx().toFixed(2);
    document.querySelector("#tempKx").innerHTML = CalcKx(RandProcArr, TempXmax, TempXhyzm).toFixed(2);
    document.querySelector("#pressKx").innerHTML = CalcKx(RandProcArr, PressXmax, PressXhyzm).toFixed(2);
    document.querySelector("#sumSurPerAndArrT").innerHTML = CalSumSurPerAndArrT().t.toFixed(2);
    PlotCorrWithOrd(CalcCorrWithOrd());
    console.log(JSON.stringify(CalcCorrWithOrd()));

    function calculateDispersion(array) {
        const mean = array.reduce((acc, val) => acc + val, 0) / array.length;
        const squaredDifferences = array.map(val => Math.pow(val - mean, 2));
        const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / array.length;
        return variance;
    }

    function CalcKx(Arr, Max, Hyzm) {
        let Dx = calculateDispersion(Arr);
        return (2 * Dx - (Max ** 2 - Hyzm ** 2)) / 2;
    }

    function CalcRiseKx() {
        let ArrXmax = [];
        let ArrXhyzm = [];
        for (let i = 0; i < 1 - 0.001; i += 0.1) {
            ArrXmax.push(CalcKx(TempCorArr, i, TempXmax).toFixed(2));
            ArrXhyzm.push(CalcKx(TempCorArr, i, TempXhyzm).toFixed(2));
        }
        return [ArrXmax, ArrXhyzm];
    }

    function CalcDeclineKx() {
        let ArrXmax = [];
        let ArrXhyzm = [];
        for (let i = 1; i > 0.001; i -= 0.1) {
            ArrXmax.push(CalcKx(TempCorArr, i, TempXmax).toFixed(2));
            ArrXhyzm.push(CalcKx(TempCorArr, i, TempXhyzm).toFixed(2));
        }
        return [ArrXmax, ArrXhyzm];
    }

    function ValSampStep() {
        return 0.15 / NumCroosProc();
    }

    function NumCroosProc() {
        return RandProcArr.length / TimeCrossN()
    }

    function TimeCrossN() {
        return length / speed;
    }

    function CalrMathExpectation(array) {
        return nj.mean(array);
    }

    function linspace(start, stop, num = 50, endpoint = true) {
        if (num <= 1) {
            return [start];
        }
        const step = endpoint ? (stop - start) / (num - 1) : (stop - start) / num;
        const result = [];
        for (let i = 0; i < num; i++) {
            const value = start + step * i;
            result.push(value);
        }
        return result;
    }

    function CalcOrdin() {
        let num_points = RandProcArr.length;
        let num_time_points = Math.floor(num_points * ValSampStep());
        let time_point_indices = linspace(0, num_points - 1, num_time_points);
        let ordinVals = [];
        time_point_indices.forEach(element => {
            ordinVals.push(RandProcArr[Math.floor(element)]);
        });
        return ordinVals;
    }

    function CalcRandCorrKx() {
        let ArrX = RandProcArr;
        let J = Math.round(CalcJ());
        let N = ArrX.length;
        let sumKx = 0.0;
        let arrI = [];
        for (let i = 0; i < N - J; i++) {
            sumKx += ArrX[i] * ArrX[i + J];
            arrI.push(i);
        }
        return (1 / (N - J)) * sumKx;
    }

    function CalcJ() {
        return (nj.mean(CrossRandProc()) / CrossRandProc().length) * ValSampStep();
    }

    function CrossRandProc() {
        let resultArr = [];
        for (let i = 1; i < RandProcArr.length; i++) {
            resultArr.push(CalcKx(RandProcArr.slice(0, i), TempXmax, TempXhyzm));
        }
        return resultArr;
    }

    function CalcKx(Arr, Max, Hyzm) {
        let Dx = calculateDispersion(Arr);
        return (2 * Dx - (Max ** 2 - Hyzm ** 2)) / 2;
    }

    function CalSumSurPerAndArrT() {
        let t = ValSampStep();
        let ArrT = [];
        for (let i = 0; i < RandProcArr.length; i++) {
            ArrT.push(t.toFixed(2));
            t += ValSampStep()
        }
        return { t: t, ArrT: ArrT };
    }

    function CalcCorrWithOrd() {
        let deltaT = ValSampStep();
        let arr = RandProcArr;
        let step = Math.floor(1 / deltaT);
        let slice1 = [];
        for (let i = 0; i < arr.length; i += step) {
            slice1.push(arr[i]);
        }
        let slice2 = [];
        for (let i = 1; i < arr.length; i += step) {
            slice2.push(arr[i]);
        }
        return correlate(slice1, slice2);
    }

    function correlate(x, y) {
        const n = Math.max(x.length, y.length);
        const result = [];

        for (let lag = -n + 1; lag < n; lag++) {
            let sum = 0;

            for (let i = 0; i < n; i++) {
                const j = i - lag;
                if (j >= 0 && j < n) {
                    sum += (x[i] || 0) * (y[j] || 0);
                }
            }

            result.push(sum);
        }

        return result;
    }

    function PlotCorrWithOrd(CorArr) {
        let corrFuncPositive = CorArr;
        let time = nj.arange(CorArr.length).selection.data;

        const ctx = document.querySelector("#lab2Chart");
        const data = {
            labels: time,
            datasets: [
                {
                    label: 'Графік кореляційної функції випадкового процесу',
                    data: corrFuncPositive,
                    borderColor: 'rgb(255, 205, 86)',
                    backgroundColor: 'rgba(255, 205, 86, 0.5)',
                }
            ]
        };
        const config = {
            type: 'line',
            data: data,
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgb(255, 255, 255)',
                            font: {
                                size: 18
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: { color: 'rgb(255, 255, 255)' },
                        grid: {
                            color: 'rgb(72, 72, 72)'
                        }
                    },
                    x: {
                        ticks: { color: 'rgb(255, 255, 255)' },
                        grid: {
                            color: 'rgb(72, 72, 72)'
                        }
                    }
                }
            }
        };
        new Chart(ctx, config);
    }


}