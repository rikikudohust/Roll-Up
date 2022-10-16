//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// 2019 OKIMS
//      ported to solidity 0.6
//      fixed linter warnings
//      added requiere error messages
//
//
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import {Pairing} from './Pairing.sol';


contract UpdateVerifier {
    using Pairing for *;
    struct UpdateVerifyingKey {
        Pairing.G1Point alfa1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[] IC;
    }
    struct UpdateProof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }
    function updateVerifyingKey() internal pure returns (UpdateVerifyingKey memory vk) {
        vk.alfa1 = Pairing.G1Point(
            20491192805390485299153009773594534940189261866228447918068658471970481763042,
            9383485363053290200918347156157836566562967994039712273449902621266178545958
        );

        vk.beta2 = Pairing.G2Point(
            [4252822878758300859123897981450591353533073413197771768651442665752259397132,
             6375614351688725206403948262868962793625744043794305715222011528459656738731],
            [21847035105528745403288232691147584728191162732299865338377159692350059136679,
             10505242626370262277552901082094356697409835680220590971873171140371331206856]
        );
        vk.gamma2 = Pairing.G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );
        vk.delta2 = Pairing.G2Point(
            [1445005666465390531414285909261221245579448954837838847980610561947261085360,
             152233918815445949219350062240560907112595088895179635352167884451481013768],
            [4571925765473590503484983339900371803516780685584680558491445177420759627529,
             12308378112485978466126629743140340944195867872222353416805573786652472283458]
        );
        vk.IC = new Pairing.G1Point[](16);
        
        vk.IC[0] = Pairing.G1Point( 
            18059495995919047528718565439802302748586769904932598444197188087552517216930,
            6579324964327208602785214967435060621298596458144714199389125781148234710305
        );                                      
        
        vk.IC[1] = Pairing.G1Point( 
            4080805860339782374444357887335727764820533188055139470081969609549472356340,
            2015792520811144991293692540053681215500940319576114446279973364754128008175
        );                                      
        
        vk.IC[2] = Pairing.G1Point( 
            19533489081439856329633213702486594033603893822937715720111679178412437215609,
            14297524209906049831555772461227756583454153609070997119373810294935431367425
        );                                      
        
        vk.IC[3] = Pairing.G1Point( 
            18772126385555422458190813739848459074689548784828025692312408297225958332711,
            14530433221386383387786543735697375698668783410888147946349358174052795688666
        );                                      
        
        vk.IC[4] = Pairing.G1Point( 
            3068417913575543953532576051275613780507942882737272896927817245001682135424,
            20892931373980874897827541250460770468225247790126084783873424259092332995449
        );                                      
        
        vk.IC[5] = Pairing.G1Point( 
            11215631251808181276967380887852136998547226578608920421302030982103257028655,
            8124797392899964367669261419524156228403127348610437367400934934144516659913
        );                                      
        
        vk.IC[6] = Pairing.G1Point( 
            21243172231854687481632957130718877725859748289423995538274733283071223413515,
            15855528082018602649616552386714960004222121929131535409652999494622355220378
        );                                      
        
        vk.IC[7] = Pairing.G1Point( 
            7890820038973547996314166735256827239335609791670865562094635415719403394580,
            1372021574368596754796707502480832378586501505793118791355456772248202503689
        );                                      
        
        vk.IC[8] = Pairing.G1Point( 
            18377072214170062872063030223673669744843682109399028609020558389430306852551,
            7463540458584180889890008817797843250734748165303939999713857510860853151887
        );                                      
        
        vk.IC[9] = Pairing.G1Point( 
            1171927101634829957805273952853879099043457454485812915943339256375982072020,
            8705238424484427331195114814067251034262479817954840045263450350590126490593
        );                                      
        
        vk.IC[10] = Pairing.G1Point( 
            6491961798459819776559072757010424809056199859320735898231791787248059730602,
            20621245281174756938170716313661583716864768546891661872069184469522940764298
        );                                      
        
        vk.IC[11] = Pairing.G1Point( 
            12626636117931174192289835761637342339828305089914553308118889294934352752683,
            17642679192264944027710350362233177262748739921170531528877803959468258578907
        );                                      
        
        vk.IC[12] = Pairing.G1Point( 
            11452622093239301749029740662676365865784089237186450523682153314438245185920,
            20797003405690499570936013633290909092799811728705678351004112268505835253452
        );                                      
        
        vk.IC[13] = Pairing.G1Point( 
            7067610896024094065012069816521215088464682623205103113036685617523252091610,
            10411688415432646200958856645387055008743307876255821960082379457083556035517
        );                                      
        
        vk.IC[14] = Pairing.G1Point( 
            9273390725488027356102068981751242623881461698612350979947267870503530400487,
            6554051187530869681345485584634417061603489009194014547670078784631609385595
        );                                      
        
        vk.IC[15] = Pairing.G1Point( 
            11742900273535033670715216529421743950527661790104149513262164134127923331750,
            4629455862769712409820699717659489243421403899806291869241236285703678272291
        );                                      
        
    }
    function verify(uint[] memory input, UpdateProof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        UpdateVerifyingKey memory vk = updateVerifyingKey();
        require(input.length + 1 == vk.IC.length,"verifier-bad-input");
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field,"verifier-gte-snark-scalar-field");
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.IC[0]);
        if (!Pairing.pairingProd4(
            Pairing.negate(proof.A), proof.B,
            vk.alfa1, vk.beta2,
            vk_x, vk.gamma2,
            proof.C, vk.delta2
        )) return 1;
        return 0;
    }
    /// @return r  bool true if proof is valid
    function verifyUpdateProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[15] memory input
        ) public view returns (bool r) {
        UpdateProof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.C = Pairing.G1Point(c[0], c[1]);
        uint[] memory inputValues = new uint[](input.length);
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}

