<template>
  <div>
    <div>
      <v-file-input
        id="file"
        ref="file"
        show-size
        accept=".csv"
        @change="onFileChange"
        @click:clear="csv_data=null"
        label="csvファイルを入力してください"
      ></v-file-input>
    </div>
    <div>
      <v-btn
        class="black--text mt-5"
        block
        height="40"
        color=""
        @click="check_csv()"
      >CSVから登録</v-btn>
    </div>
    <div>
      <v-data-table
        :headers="headers"
        :items="new_csv"
        item-key="id"
        class="elevation-0"
        fixed-header
        hide-default-header
      ></v-data-table>
    </div>
    <div>
      result: <br/>{{result}}
      <div>
        <br/>
        ↑入力直後に読み込まれたCSVの文字列がresultに格納される
      </div>
    </div>
  </div>
</template>

<script>
import Encoding from  'encoding-japanese';

export default {
  name: 'IndexPage',
  data() {
    return {
      result: null,
      csv_data: null,
      new_csv: [],
      headers: [
        {
          text: 'お手伝い',
          align: 'start',
          sortable: false,
          value: 'content',
        },
        {
          text: '報酬（パパ円）',
          value: 'price'
        }
      ],
    }
  },
  methods: {
    onFileChange(file) {
      const vm = this;
      if (file) {
        if (file.name.indexOf('.csv') > -1) {
          vm.get_csv_data(file)
          //.then(vm.changeToUTF)
          //.then(vm.process_csv_data)
        }
      }
      else {
        console.log('not in file');
      }
    },
    get_csv_data(file) {
      return new Promise((resolve, reject) => {
        console.log('get_csv_data');
        const reader = new FileReader();
        reader.onload = (e) => {
          console.log(e.target.result)
          var array = new Uint8Array(e.target.result);
          // 文字コードを取得
          console.log(array)
          console.log(Encoding.detect(array))
          switch (Encoding.detect(array)) {
          case 'UTF16':
              // 16ビット符号なし整数値配列と見なす
              array = new Uint16Array(e.target.result);
              break;
          case 'UTF32':
              // 32ビット符号なし整数値配列と見なす
              array = new Uint32Array(e.target.result);
              break;
          }
          // Unicodeの数値配列に変換
          var unicodeArray = Encoding.convert(array, 'UNICODE');
          // Unicodeの数値配列を文字列に変換
          var text = Encoding.codeToString(unicodeArray);
          console.log(text); // 結果
          // let text = e.target.result.split('\r\n').toString().split(',');
          // for (let i = 2; i < text.length; i+=2) {
          //   console.log(text[i]);
          //   let array = new Uint8Array(text[i])
          //   console.log(array);
          //   //let bytes = Encoding.stringToCode(text[i]); //このとき，このテキストが強制的にUNICODEの文字コードに変換されている．
          //   console.log(Encoding.detect(array));

          // }
          
          resolve(e.target.result.split())
        };
        reader.onerror = () => reject(error);
        reader.readAsText(file);
      })
    },
    //文字コードを判定して，UTF-８（BOMあり）に変換する
    changeToUTF(res) {
      return new Promise((resolve)=>{
        const unicodeArray = Encoding.convert(fs.readFileSync(res), {
          to: 'UTF8',
          from: 'AUTO'
        });
        console.log(Encoding.codeToString(unicodeArray));
        this.result = unicodeArray;
      })
    },
    process_csv_data(res) {
      console.log('process_csv_data');
      let vm = this;
      let result = res;
      vm.result = result;
      let header = result[0].split(',')
      result.shift();
      result.pop();
      vm.csv_data = result.map(item=>{
        let datas = item.split(',');
        let temp = {};
        for (const index in datas) {
          let key = header[index];
          temp[key] = datas[index];
        }
        return temp;
      })
    },
    check_csv() {
      console.log('check_csv');
      const vm = this;
      vm.new_csv = []; //前のデータを空にする
      //登録の際の記入ミスがないかをチェック
      console.log(vm.csv_data);
      vm.csv_data.forEach((data, index) => {
        data.id = index;
        this.new_csv.push(data);
      })
    },
  }
}
</script>
