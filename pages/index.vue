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
        ↑入力直後の文字コード
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
      result: "",
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
          .then(vm.process_csv_data)
        }
      }
      else {
        console.log('not in file');
      }
    },
    //fileデータから文字コードを判定して，UNICODEに変換したファイルデータに置き換える処理．
    get_csv_data(file) {
      return new Promise((resolve, reject) => {
        console.log('get_csv_data');
        const reader = new FileReader();
        reader.onload = (e) => {
          //readAsArrayBufferによりe.target.resultはバイナリデータ扱いされる．
          //uint8arrayにより数値配列に変換できる．＝＞detect()で扱える形になるから嬉しいってこと．
          let codes = new Uint8Array(e.target.result); 
          let encoding = Encoding.detect(codes);
          this.result = encoding;
          let unicodeString = Encoding.convert(codes, {
            to : 'unicode',
            from : encoding,
            type: 'string'
          });
          resolve(unicodeString.split(/\r\n|\n/)) //Windowsとmacで改行コードが異なるから．typeはStringになっている
        };
        reader.onerror = () => reject(error);
        //上までの記述はイベントに対しての記述であり，実際に最初に実行されるのはこのコードのみ．
        //reader.readAsText(file); //readerを用いてファイルをTextデータ（おそらくString）として読み取るための関数
        reader.readAsArrayBuffer(file);  //readerを用いてファイルをBinurryデータとして読み取るための関数
      })
    },
    //get_csv_dataからUNICODEに変換された文字列を受け取り，それをテーブルに渡せる形に成型する．
    process_csv_data(result) {
      console.log('process_csv_data');
      let vm = this;
      console.log(result);
      let header = result[0].split(',')
      header = ['content', 'price'];
      result.shift(); //header分を削除しておく
      console.log(result);
      result.pop(); //理由は不明だが，最後に一行だけ空白データが入るので消去
      vm.new_csv = result.map(item=>{
        let datas = item.split(',');
        let temp = {};
        for (const index in datas) {
          let key = header[index];
          temp[key] = datas[index];
        }
        return temp;
      })
      console.log(vm.new_csv);
    },
  }
}
</script>
