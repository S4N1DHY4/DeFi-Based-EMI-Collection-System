const ProposalState = {
  0: "ACCEPTED",
  1: "ACCEPTING",
  2: "WAITING",
};

App = {
  crypt: "",

  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.loadProposals();
  },

  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        await ethereum.enable();
      } catch (error) {
      }
    }
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
    }
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },
  loadAccount: async () => {
    App.account = (await web3.eth.getAccounts())[0];
  },

  loadContract: async () => {
    App.contract = new web3.eth.Contract(abi, address);
    App.contract_2 = new web3.eth.Contract(abi_2, address_2);
  },

  loadProposals: async () => {
    const proposals = await App.contract.methods.getAllProposals().call();
    console.log(proposals);

    var todayDate = new Date();

    proposals.forEach((proposal) => {
      var proposalId = proposal.proposalId;
      var date = new Date(proposal.time * 1000);

      var dueDate =
        date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        console.log(proposal.sendMoney);

      if (todayDate.getDate() >= date.getDate() + 1) {
        var vis1 = "hidden";
        var vis2 = "visible";
      } else {
        vis1 = "visible";
        vis2 = "hidden";
      }

        var string = "";
        if(proposal.sendMoney){
          string += "Send Money";
          $(".table").append(` <tr>
          <td data-label="Borrower Address">
            ${proposal.borrower}
          </td>
          <td data-label="Amount">${proposal.amount}</td>
          <td data-label="Due Date">${dueDate}</td>
          <td data-label="">
            <a href="#" class="btn btn__active" onClick = App.sendMoney(${proposalId}) style="visibility:${vis1}">${string}</a>
          </td>
           <td>
            <a href="./details.html?a=${proposalId}" class="btn btn__active">Get Details</a>
<button class="revoke" onClick=App.revokeMortgage(${proposalId}) style="visibility:${vis2}">Revoke Mortgage</button>
            </td>
          <td data-label="Status">${ProposalState[proposal.state]}</td>
        </tr>`)
        }
        else{
          string += "Give Loan";
          $(".table").append(` <tr>
          <td data-label="Borrower Address">
            ${proposal.borrower}
          </td>
          <td data-label="Amount">${proposal.amount}</td>
          <td data-label="Due Date">${dueDate}</td>
          <td data-label="">
            <a href="./lend.html?borrower=${proposalId}" class="btn btn__active">${string}</a>
          </td>
           <td>
            <a href="./details.html?a=${proposalId}" class="btn btn__active">Get Details</a>
            </td>
          <td data-label="Status">${ProposalState[proposal.state]}</td>
        </tr>`)
        }

    
    });
  },

revokeMortgage: async (Id) => {
  },

  sendMoney : async (proposalId) => {
    const loans = await App.contract.methods.getAllLoans().call();
    loans.forEach(async loan => {
      if(loan.proposalId == proposalId) {
        const borrower = await App.contract.methods.proposalToBorrower(loan.proposalId).call();

        console.log(borrower);
        console.log(App.account);

        await web3.eth.sendTransaction({from:App.account, to: borrower, value: web3.utils.toWei(loan.loanAmount, 'ether')})
        .then(async function(receipt){
          console.log(receipt);
        })
    }
  })
  }
 
  
  
};

$(document).ready(() => {
  App.load();
});