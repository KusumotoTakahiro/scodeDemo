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
import readFile from '~/plugins/myplugin';

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
      array: process.env.array,
      fs: process.env.fs,
    }
  },
  mounted() {
    console.log(readFile('assets/format.csv'))
    console.log(this.fs);
    console.log(this.array);
  },
  methods: {
    onFileChange(file) {
      const vm = this;
      if (file) {
        if (file.name.indexOf('.csv') > -1) {
          vm.get_csv_data(file)
          .then(vm.changeToUTF)
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
          resolve(e.target.result.split('\r\n'))
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
        // let result = "";
        // console.log(res)
        // for (let i = 1; i < res.length; i++) {
        //   result += ","+res[i].split(',');
        // }
        
        // //始めと終わりのコロンを削除した文字列を与えて，文字コードに置き換える
        // let array = result.slice(1,result.length-1).slice('');
        // let utfarray = [];
        // //console.log(array)
        // let hello = 'こんにちは';
        // for (let i = 0; i < hello.length; i++) {
        //   //console.log(array.charCodeAt(i));
        //   utfarray.push(hello.charCodeAt(i));
        // }
        // console.log(utfarray);
        // //this.result = utfarray;

        // let detectedEncoding = Encoding.detect(utfarray); //arrayを入れてもsjis(shiftjisともutf-8とも判定できていない)
        // console.log(detectedEncoding);
        // this.result = detectedEncoding;
        // if (detectedEncoding==="UTF8") {
        //   console.log(detectedEncoding);
        // }
        // if (detectedEncoding==="sjis") {
        //   console.log(detectedEncoding);
        // }
        // if (detectedEncoding==='UNICODE') {
        //   console.log(detectedEncoding);
        // }
        // else { //sjisの場合
        //   const unicodeArray = Encoding.convert(utfarray, {
        //     to: 'UTF8',
        //     from: 'UNICODE'
        //   });
        //   console.log(Encoding.codeToString(unicodeArray));
        // }
        
        
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
