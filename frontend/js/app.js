var app = new Vue({
    el: '#hamming-encoder',
    data: {
        dataBits: [],
        status: '',
        numberOfDataBits: document.getElementById("numOfBits").data
    },
    created: function () {
        this.initDataBits(0);
        
    },
    methods: {
        initDataBits: function(){
            this.dataBits=[];
           
            for(var i=0;i<this.numberOfDataBits;i++){
                var bit = { data: null };
                this.dataBits.push(bit);
            }
           
        },
        send: function () {
            if (this.validate(this.dataBits) === true){
                var encodedMessage = this.encode(this.dataBits);
                return axios.put("http://localhost:3000/message", {bits: encodedMessage}).then(
                    response => (this.status = response.data)
                );
            } else {
                this.status = 'Input is not valid. Please use 0 or 1 as data bit values';
            }
        },
        encode: function(bits){
            var number1 = this.numberOfDataBits;
            var dta = [], mess = [];
            var i=1, j=0, t = 0, numberOfC=0;
            while(j<number1) {

                if(this.powerOfTwo(i)===true) 
                    dta.push(-1);
                else
                    {dta.push(bits[j].data);
                        j++;}
                i++;        
            
            }

            while(t<number1) {
                mess.push(parseInt(bits[t].data));
                t++;        
            }
            
            for (var i=0; i<dta.length;i++)  {
                if(dta[i] == 1) {
                    dta[i] = 1;
                }

                if(dta[i] == -1) {
                    numberOfC ++;
                    dta[i] = 0;
                }
            }

             
            var widthMatrix = dta.length;
            var lengthMatrix = numberOfC;

            var matrix =[];
            var arr = [];

            for(var i=0;i<dta.length;i++) {
                arr[i] = parseInt(dta[i]);
            }
            
            var arr1 = [];
            for(var i=0;i<arr.length;i++)
                arr1[i] = [];

            for(var i=0;i<arr.length;i++)
                for(var j=0;j<1;j++)
                   arr1[i][j] = arr[i];
            
            
            for(var i=0; i<widthMatrix; i++) {
                matrix[i] = [];
                var num = this.dec2Bin(i+1);
                var num1 = this.pad(num,lengthMatrix);
            
                num1 = this.reverseNumber(num1);
                for (var j=0; j<lengthMatrix; j++)
                {
                    matrix[i][j] = num1 % 10;
                    num1 = num1/10|0;  
                }
            }

            var matrix1 = this.transposeArrayMatrix(matrix,lengthMatrix,widthMatrix);
            var sum = 0;
            var c =[];

            for(var i=0;i<lengthMatrix;i++) {
                for(var j=0;j<widthMatrix;j++) {
                        sum = sum + matrix1[i][j] * arr1[j];
                }
                c[i] = this.parity(sum);
                sum = 0;
            }

           var matrix2 = [];
           var k = c.length-1, l = 0;

           
           for (var i=0; i<arr.length;i++) {
                if(this.powerOfTwo(i+1)===true){
                    matrix2.push(c[k]);
                    k --;
                }
                else {
                    matrix2.push(mess[l]);
                    l++;
                }
           }
           console.log("Mesaj transmis: ");
           console.log(matrix2);  
          
           for(var i=0; i<matrix2.length;i++) {
               bits[i] = matrix2[i];
           }
           var lung = bits.length;
            return [bits,matrix1,widthMatrix,lengthMatrix];
        },
        parity: function(number){
            return number % 2;
        },
        reverseNumber: function(number) {
            number = number + "";
            return number.split("").reverse("").join("");
        },
        transposeArrayMatrix: function(array, width, length) {
            var newArray = [];
            for(var i=0; i<width; i++) {
                newArray[i] = [];
            }
            for(var i=0; i<length; i++){
                for(var j=0; j<width; j++) {
                    newArray[j].push(array[i][j]);
                }
            }
            return newArray;
        },
        pad: function(num,size) {
            while(num.length < size) num = "0" + num;
            return num;
        },
        powerOfTwo: function(number){
            return (Math.log(number)/Math.log(2)) % 1 === 0;
        },
        dec2Bin:function(number) {
            return number.toString(2);
        },
        validate: function(bits){
            for(var i=0; i<bits.length;i++){
                if (this.validateBit(bits[i].data) === false)
                return false;
            }
            return true;
        },
        validateBit: function(character){
            if (character === null) return false;
            return (parseInt(character) === 0 ||
            parseInt(character) === 1);  
        }
    }
})